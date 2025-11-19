import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import TaxTokenABI from '../abi/TaxToken.json';
import PancakeRouterABI from '../abi/PancakeRouter.json';
import { CONTRACT_ADDRESS, SUPPORTED_CHAINS, REQUIRED_CHAIN_ID, UPDATE_INTERVAL, PANCAKE_ROUTER } from '../constants';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // 合约状态
  const [tokenBalance, setTokenBalance] = useState('0');
  const [bnbBalance, setBnbBalance] = useState('0');
  const [buyTax, setBuyTax] = useState({ rewardTax: 0, burnTax: 0, marketingTax: 0 });
  const [sellTax, setSellTax] = useState({ rewardTax: 0, burnTax: 0, marketingTax: 0 });
  const [presaleInfo, setPresaleInfo] = useState(null);
  const [lpInfo, setLpInfo] = useState(null);
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [presaleActive, setPresaleActive] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  // UI 状态
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Toast 函数
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 800);
  }, []);

  // 检查是否在支持的网络
  const isSupportedNetwork = chainId === REQUIRED_CHAIN_ID;

  // 切换到支持的网络
  const switchToRequiredNetwork = async () => {
    if (!window.ethereum) {
      showToast('未检测到钱包，请先安装或打开 MetaMask', 'error');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SUPPORTED_CHAINS[REQUIRED_CHAIN_ID].chainId }],
      });
      // 主动刷新 chainId
      const cid = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(cid, 16));
      showToast('已切换到 BSC Testnet', 'success');
    } catch (switchError) {
      if (switchError?.code === 4902) {
        // 如果网络不存在，添加网络
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SUPPORTED_CHAINS[REQUIRED_CHAIN_ID]],
          });
          const cid = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(cid, 16));
          showToast('已添加并切换到 BSC Testnet', 'success');
        } catch (addError) {
          console.error('添加网络失败:', addError);
          showToast(addError?.message || '添加网络失败', 'error');
        }
      } else {
        console.error('切换网络失败:', switchError);
        showToast(switchError?.message || '切换网络失败', 'error');
      }
    }
  };

  // 添加流动性（站内一键）
  const addLiquidity = async (tokenAmount, bnbAmount, slippageBps = 300) => {
    // slippageBps: 千分比，默认 3%
    if (!contract || !signer || !provider || !userAddress) {
      showToast('请先连接钱包', 'error');
      return;
    }
    // 规则：未开启交易时，仅限合约所有者添加流动性
    if (!tradingEnabled && !isOwner) {
      showToast('未开启交易：仅合约所有者可添加流动性', 'error');
      return;
    }
    if (!chainId || !(chainId in PANCAKE_ROUTER)) {
      showToast('当前网络不支持添加流动性', 'error');
      return;
    }

    try {
      setLoading(true);
      const routerAddress = PANCAKE_ROUTER[chainId];
      const router = new ethers.Contract(routerAddress, PancakeRouterABI, signer);

      const amountTokenDesired = ethers.parseEther(tokenAmount);
      const amountETHDesired = ethers.parseEther(bnbAmount);

      const amountTokenMin = amountTokenDesired - (amountTokenDesired * BigInt(slippageBps)) / BigInt(10000);
      const amountETHMin = amountETHDesired - (amountETHDesired * BigInt(slippageBps)) / BigInt(10000);

      // 1) 先授权 Router 花费 TAX
      const allowance = await contract.allowance(userAddress, routerAddress);
      if (allowance < amountTokenDesired) {
        const approveTx = await contract.approve(routerAddress, amountTokenDesired);
        showToast('授权 Router 中...', 'success');
        await approveTx.wait();
      }

      // 2) 调用 addLiquidityETH，注入 BNB
      const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 分钟
      const tx = await router.addLiquidityETH(
        CONTRACT_ADDRESS,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        userAddress,
        deadline,
        { value: amountETHDesired }
      );

      showToast('添加流动性交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('添加流动性成功！', 'success');

      await fetchBalances();
      await fetchContractInfo();
    } catch (error) {
      console.error('添加流动性失败:', error);
      showToast(error?.reason || error?.message || '添加流动性失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Swap: BNB -> TAX
  const swapBNBForTokens = async (bnbAmount, slippageBps = 300) => {
    if (!contract || !signer || !provider || !userAddress) {
      showToast('请先连接钱包', 'error');
      return;
    }
    if (!chainId || !(chainId in PANCAKE_ROUTER)) {
      showToast('当前网络不支持 Swap', 'error');
      return;
    }

    try {
      setLoading(true);
      const routerAddress = PANCAKE_ROUTER[chainId];
      const router = new ethers.Contract(routerAddress, PancakeRouterABI, signer);

      const amountIn = ethers.parseEther(bnbAmount);

      // 获取预期输出
      const path = [await router.WETH(), CONTRACT_ADDRESS];
      const amounts = await router.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[1] - (amounts[1] * BigInt(slippageBps)) / BigInt(10000);

      const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 分钟

      // 调用 swapExactETHForTokens
      const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        amountOutMin,
        path,
        userAddress,
        deadline,
        { value: amountIn }
      );

      showToast('兑换交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('兑换成功！', 'success');

      await fetchBalances();
      await fetchContractInfo();
    } catch (error) {
      console.error('BNB->TAX 兑换失败:', error);
      showToast(error?.reason || error?.message || '兑换失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Swap: TAX -> BNB
  const swapTokensForBNB = async (tokenAmount, slippageBps = 300) => {
    if (!contract || !signer || !provider || !userAddress) {
      showToast('请先连接钱包', 'error');
      return;
    }
    if (!chainId || !(chainId in PANCAKE_ROUTER)) {
      showToast('当前网络不支持 Swap', 'error');
      return;
    }

    try {
      setLoading(true);
      const routerAddress = PANCAKE_ROUTER[chainId];
      const router = new ethers.Contract(routerAddress, PancakeRouterABI, signer);

      const amountIn = ethers.parseEther(tokenAmount);

      // 1) 检查并授权
      const allowance = await contract.allowance(userAddress, routerAddress);
      if (allowance < amountIn) {
        const approveTx = await contract.approve(routerAddress, ethers.MaxUint256);
        showToast('授权 Router 中...', 'success');
        await approveTx.wait();
      }

      // 获取预期输出
      const path = [CONTRACT_ADDRESS, await router.WETH()];
      const amounts = await router.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[1] - (amounts[1] * BigInt(slippageBps)) / BigInt(10000);

      const deadline = Math.floor(Date.now() / 1000) + 1200;

      // 调用 swapExactTokensForETH
      const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn,
        amountOutMin,
        path,
        userAddress,
        deadline
      );

      showToast('兑换交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('兑换成功！', 'success');

      await fetchBalances();
      await fetchContractInfo();
    } catch (error) {
      console.error('TAX->BNB 兑换失败:', error);
      showToast(error?.reason || error?.message || '兑换失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 授权代币用于 Swap
  const approveTokenForSwap = async () => {
    if (!contract || !signer || !userAddress) {
      showToast('请先连接钱包', 'error');
      return;
    }
    if (!chainId || !(chainId in PANCAKE_ROUTER)) {
      showToast('当前网络不支持 Swap', 'error');
      return;
    }

    try {
      setLoading(true);
      const routerAddress = PANCAKE_ROUTER[chainId];
      const tx = await contract.approve(routerAddress, ethers.MaxUint256);
      showToast('授权交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('授权成功！', 'success');
      return true;
    } catch (error) {
      console.error('授权失败:', error);
      showToast(error?.reason || error?.message || '授权失败', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 获取兑换报价
  const getSwapQuote = async (fromToken, toToken, amount) => {
    if (!provider || !contract) return null;
    if (!chainId || !(chainId in PANCAKE_ROUTER)) return null;
    if (!amount || parseFloat(amount) <= 0) return null;

    try {
      const routerAddress = PANCAKE_ROUTER[chainId];
      const router = new ethers.Contract(routerAddress, PancakeRouterABI, provider);

      const amountIn = ethers.parseEther(amount);
      let path, amounts, hasAllowance;

      if (fromToken === 'BNB') {
        // BNB -> TAX
        path = [await router.WETH(), CONTRACT_ADDRESS];
        amounts = await router.getAmountsOut(amountIn, path);
        hasAllowance = true; // BNB 不需要授权
      } else {
        // TAX -> BNB
        path = [CONTRACT_ADDRESS, await router.WETH()];
        amounts = await router.getAmountsOut(amountIn, path);

        // 检查授权
        if (userAddress) {
          const allowance = await contract.allowance(userAddress, routerAddress);
          hasAllowance = allowance >= amountIn;
        } else {
          hasAllowance = false;
        }
      }

      const outputAmount = ethers.formatEther(amounts[1]);
      const rate = parseFloat(outputAmount) / parseFloat(amount);

      // 简单的价格影响估算（实际应该从流动性池计算）
      const priceImpact = Math.abs((1 - rate) * 100);

      return {
        outputAmount,
        rate,
        priceImpact,
        hasAllowance
      };
    } catch (error) {
      console.error('获取报价失败:', error);
      return null;
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('请安装 MetaMask', 'error');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = accounts[0];
        const network = await provider.getNetwork();

        setProvider(provider);
        setSigner(signer);
        setUserAddress(address);
        setChainId(Number(network.chainId));

        // 初始化合约
        const contract = new ethers.Contract(CONTRACT_ADDRESS, TaxTokenABI, signer);
        setContract(contract);

        showToast('钱包连接成功', 'success');
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      showToast('连接钱包失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 断开钱包
  const disconnectWallet = () => {
    setUserAddress(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setIsOwner(false);
    showToast('钱包已断开', 'success');
  };

  // 获取余额
  const fetchBalances = useCallback(async () => {
    if (!userAddress || !provider || !contract) return;

    try {
      const bnb = await provider.getBalance(userAddress);
      setBnbBalance(ethers.formatEther(bnb));

      const tokens = await contract.balanceOf(userAddress);
      setTokenBalance(ethers.formatEther(tokens));
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  }, [userAddress, provider, contract]);

  // 获取合约信息
  const fetchContractInfo = useCallback(async () => {
    if (!contract) return;

    try {
      const [buyTaxData, sellTaxData, trading, presale] = await Promise.all([
        contract.buyTax(),
        contract.sellTax(),
        contract.tradingEnabled(),
        contract.presaleActive()
      ]);

      setBuyTax({
        rewardTax: Number(buyTaxData.rewardTax),
        burnTax: Number(buyTaxData.burnTax),
        marketingTax: Number(buyTaxData.marketingTax)
      });

      setSellTax({
        rewardTax: Number(sellTaxData.rewardTax),
        burnTax: Number(sellTaxData.burnTax),
        marketingTax: Number(sellTaxData.marketingTax)
      });

      setTradingEnabled(trading);
      setPresaleActive(presale);

      // 检查是否是合约所有者
      if (userAddress) {
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === userAddress.toLowerCase());

        // 获取白名单状态
        const whitelisted = await contract.isWhitelisted(userAddress);
        setIsWhitelisted(whitelisted);

        // 获取预售信息
        const presaleData = await contract.getPresaleInfo(userAddress);
        setPresaleInfo({
          isWhitelisted: presaleData.isWhitelisted,
          allocation: ethers.formatEther(presaleData.allocation),
          purchased: ethers.formatEther(presaleData.purchased),
          remaining: ethers.formatEther(presaleData.remaining)
        });

        // 获取LP信息
        const lpData = await contract.getLPHolderInfo(userAddress);
        setLpInfo({
          lpBalance: ethers.formatEther(lpData.lpBalance),
          lpPercentage: Number(lpData.lpPercentage) / 100,
          estimatedRewards: ethers.formatEther(lpData.estimatedRewards),
          totalClaimed: ethers.formatEther(lpData.totalClaimed)
        });
      }
    } catch (error) {
      console.error('获取合约信息失败:', error);
    }
  }, [contract, userAddress]);

  // 预售购买
  const buyPresale = async (bnbAmount) => {
    if (!contract) {
      showToast('请先连接钱包', 'error');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.buyPresale({
        value: ethers.parseEther(bnbAmount)
      });

      showToast('交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('购买成功!', 'success');

      await fetchBalances();
      await fetchContractInfo();
    } catch (error) {
      console.error('购买失败:', error);
      showToast(error.reason || '购买失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 领取LP奖励
  const claimRewards = async () => {
    if (!contract) {
      showToast('请先连接钱包', 'error');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.claimRewards();

      showToast('交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('领取成功!', 'success');

      await fetchBalances();
      await fetchContractInfo();
    } catch (error) {
      console.error('领取失败:', error);
      showToast(error.reason || '领取失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 管理员功能：开启交易
  const enableTrading = async () => {
    if (!contract || !isOwner) {
      showToast('仅限管理员操作', 'error');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.enableTrading();

      showToast('交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('交易已开启!', 'success');

      await fetchContractInfo();
    } catch (error) {
      console.error('开启交易失败:', error);
      showToast(error.reason || '操作失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 管理员功能：更新买入税
  const updateBuyTax = async (reward, burn, marketing) => {
    if (!contract || !isOwner) {
      showToast('仅限管理员操作', 'error');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.updateBuyTax(reward, burn, marketing);

      showToast('交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('税率更新成功!', 'success');

      await fetchContractInfo();
    } catch (error) {
      console.error('更新税率失败:', error);
      showToast(error.reason || '操作失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 管理员功能：更新卖出税
  const updateSellTax = async (reward, burn, marketing) => {
    if (!contract || !isOwner) {
      showToast('仅限管理员操作', 'error');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.updateSellTax(reward, burn, marketing);

      showToast('交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('税率更新成功!', 'success');

      await fetchContractInfo();
    } catch (error) {
      console.error('更新税率失败:', error);
      showToast(error.reason || '操作失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 管理员功能：添加预售白名单
  const addPresaleWhitelist = async (address, allocation) => {
    if (!contract || !isOwner) {
      showToast('仅限管理员操作', 'error');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.addToPresaleWhitelist(
        address,
        ethers.parseEther(allocation)
      );

      showToast('交易已提交，等待确认...', 'success');
      await tx.wait();
      showToast('白名单添加成功!', 'success');
    } catch (error) {
      console.error('添加白名单失败:', error);
      showToast(error.reason || '操作失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 监听账户和网络变化
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setUserAddress(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // 启动时主动读取当前网络（即使未连接账户）
  useEffect(() => {
    const initChain = async () => {
      if (!window.ethereum) return;
      try {
        const cid = await window.ethereum.request({ method: 'eth_chainId' });
        if (cid) setChainId(parseInt(cid, 16));
      } catch (e) {
        // 忽略，不阻塞 UI
      }
    };
    initChain();
  }, []);

  // 定时更新数据
  useEffect(() => {
    if (!userAddress || !contract) return;

    fetchBalances();
    fetchContractInfo();

    const interval = setInterval(() => {
      fetchBalances();
      fetchContractInfo();
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [userAddress, contract, fetchBalances, fetchContractInfo]);

  const value = {
    // 状态
    userAddress,
    provider,
    signer,
    contract,
    chainId,
    isOwner,
    isSupportedNetwork,
    loading,
    toast,

    // 代币信息
    tokenBalance,
    bnbBalance,
    buyTax,
    sellTax,
    tradingEnabled,
    presaleActive,
    presaleInfo,
    lpInfo,
    isWhitelisted,

    // 函数
    connectWallet,
    disconnectWallet,
    switchToRequiredNetwork,
    showToast,
    buyPresale,
    claimRewards,
    enableTrading,
    updateBuyTax,
    updateSellTax,
    addPresaleWhitelist,
    addLiquidity,
    fetchBalances,
    fetchContractInfo,

    // Swap 函数
    swapBNBForTokens,
    swapTokensForBNB,
    approveTokenForSwap,
    getSwapQuote
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
