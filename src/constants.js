// 合约配置
export const CONTRACT_ADDRESS = "0x669F53e3FA59b46d12740A20746855dCab899674"; // 替换为部署后的合约地址

export const SUPPORTED_CHAINS = {
  97: {
    chainId: '0x61',
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-testnet.publicnode.com'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  },
  56: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com']
  }
};

export const REQUIRED_CHAIN_ID = 97; // BSC Testnet

// PancakeSwap Router 地址
export const PANCAKE_ROUTER = {
  97: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // Testnet
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E"  // Mainnet
};

// 更新间隔（毫秒）
export const UPDATE_INTERVAL = 10000; // 10秒
