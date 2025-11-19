import { Routes, Route } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// 组件导入
import Header from './components/Header';
import DesktopNav from './components/DesktopNav';
import MobileBottomNav from './components/MobileBottomNav';
import ParticlesBackground from './components/ParticlesBackground';
import HomePage from './components/HomePage';
import PresalePage from './components/PresalePage';
import SwapPage from './components/SwapPage';
import RewardsPage from './components/RewardsPage';
import AdminPage from './components/AdminPage';

// 全局 Toast 组件
const GlobalToast = () => {
  const { toast } = useWeb3();
  const { t } = useTranslation();

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

// 网络错误提示
const NetworkPrompt = () => {
  const { isSupportedNetwork, switchToRequiredNetwork, chainId } = useWeb3();
  const { t } = useTranslation();

  if (isSupportedNetwork) return null;

  const getNetworkName = () => {
    if (chainId === 56) return t('header.network_bsc_mainnet');
    if (chainId === 1) return 'Ethereum Mainnet';
    if (chainId === 97) return t('header.network_bsc_testnet');
    return t('common.chain_id', { id: chainId });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-[95] bg-slate-900/95 border border-yellow-500/40 rounded-xl p-6 w-[480px] max-w-[90vw] shadow-xl shadow-yellow-500/10 text-center">
        <h4 className="text-xl font-bold mb-3 text-yellow-300">⚠️ {t('app.network_error_title')}</h4>
        <p className="text-gray-300 mb-5">
          {t('app.network_error_desc')}<br />
          {t('app.current_network')}: <span className="text-yellow-300">{getNetworkName()}</span>
        </p>
        <button
          onClick={switchToRequiredNetwork}
          className="w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors"
        >
          {t('app.switch_to_testnet')}
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8 relative pb-24 md:pb-8">
      {/* 粒子背景 */}
      <ParticlesBackground />

      {/* 头部 */}
      <Header />

      {/* 桌面导航 */}
      <DesktopNav />

      {/* 网络提示 */}
      <NetworkPrompt />

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto mt-8 md:mt-0 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/presale" element={<PresalePage />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* 移动端底部导航 */}
      <MobileBottomNav />

      {/* 全局提示 */}
      <GlobalToast />
    </div>
  );
}

export default App;
