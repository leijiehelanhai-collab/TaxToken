import { Routes, Route } from 'react-router-dom';
import { useWeb3 } from './contexts/SimpleWeb3Context';
import { FaCheckCircle, FaExclamationCircle, FaWallet } from 'react-icons/fa';
import ParticlesBackground from './components/ParticlesBackground';

// 全局 Toast 组件
const GlobalToast = () => {
  const { toast } = useWeb3();

  if (!toast.show) {
    return null;
  }

  const isError = toast.type === 'error';

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]
                 bg-slate-800/90 backdrop-blur-md rounded-lg shadow-xl
                 max-w-sm w-11/12 p-6
                 ${isError
                   ? 'border border-red-500/50 shadow-red-500/10'
                   : 'border border-cyan-500/50 shadow-cyan-500/10'
                 }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {isError ? (
          <FaExclamationCircle className="text-red-400 text-5xl" />
        ) : (
          <FaCheckCircle className="text-cyan-400 text-5xl" />
        )}
        <p className="text-white text-lg text-center">{toast.message}</p>
      </div>
    </div>
  );
};

// 简化的头部组件
const Header = () => {
  const { userAddress, connectWallet, disconnectWallet } = useWeb3();

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="relative z-20 mb-8">
      <div className="glass-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
              TAX
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gradient">TaxToken DApp</h1>
              <p className="text-xs md:text-sm text-gray-400">去中心化税收代币管理平台</p>
            </div>
          </div>

          {/* 连接钱包 */}
          <div className="flex items-center gap-3">
            {userAddress ? (
              <div className="flex items-center gap-3">
                <div className="glass-card px-4 py-2 flex items-center gap-2">
                  <FaWallet className="text-cyan-400" />
                  <span className="text-sm font-mono">{shortenAddress(userAddress)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold"
                >
                  断开
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary flex items-center gap-2">
                <FaWallet />
                <span>连接钱包</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// 简化的导航组件
const Navigation = () => {
  return (
    <nav className="relative z-20 mb-6">
      <div className="glass-card p-2">
        <div className="flex justify-center gap-2">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold">主页</a>
          <a href="/presale" className="px-6 py-3 text-gray-300 hover:bg-slate-700/50 rounded-lg font-semibold transition-all">预售</a>
          <a href="/rewards" className="px-6 py-3 text-gray-300 hover:bg-slate-700/50 rounded-lg font-semibold transition-all">奖励</a>
          <a href="/admin" className="px-6 py-3 text-gray-300 hover:bg-slate-700/50 rounded-lg font-semibold transition-all">管理</a>
        </div>
      </div>
    </nav>
  );
};

// 页面组件
const HomePage = () => {
  const { userAddress } = useWeb3();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-card p-8 text-center">
        <h2 className="text-3xl font-bold text-gradient mb-4">欢迎使用 TaxToken DApp</h2>
        <p className="text-gray-300 mb-6">支持预售、税收机制、LP奖励分配的去中心化代币管理平台</p>
        {userAddress ? (
          <p className="text-cyan-400">✅ 钱包已连接</p>
        ) : (
          <p className="text-yellow-400">⚠️ 请先连接钱包</p>
        )}
      </div>
    </div>
  );
};

const PresalePage = () => (
  <div className="max-w-4xl mx-auto">
    <div className="glass-card p-8 text-center">
      <h2 className="text-3xl font-bold text-gradient mb-4">代币预售</h2>
      <p className="text-gray-300">参与 TaxToken 预售，获得早期投资机会</p>
    </div>
  </div>
);

const RewardsPage = () => (
  <div className="max-w-4xl mx-auto">
    <div className="glass-card p-8 text-center">
      <h2 className="text-3xl font-bold text-gradient mb-4">LP 奖励</h2>
      <p className="text-gray-300">持有 LP 代币，获得交易税收奖励</p>
    </div>
  </div>
);

const AdminPage = () => (
  <div className="max-w-4xl mx-auto">
    <div className="glass-card p-8 text-center">
      <h2 className="text-3xl font-bold text-gradient mb-4">管理面板</h2>
      <p className="text-gray-300">合约管理功能，仅限管理员使用</p>
    </div>
  </div>
);

function ImprovedApp() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8 relative">
      {/* 背景 */}
      <ParticlesBackground />
      
      {/* 头部 */}
      <Header />
      
      {/* 导航 */}
      <Navigation />

      {/* 主内容 */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/presale" element={<PresalePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* 全局提示 */}
      <GlobalToast />
    </div>
  );
}

export default ImprovedApp;
