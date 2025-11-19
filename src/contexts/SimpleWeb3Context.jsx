import { createContext, useContext, useState, useCallback } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Toast 函数
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  // 连接钱包（简化版）
  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('请安装 MetaMask', 'error');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
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
    showToast('钱包已断开', 'success');
  };

  const value = {
    userAddress,
    loading,
    toast,
    connectWallet,
    disconnectWallet,
    showToast
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
