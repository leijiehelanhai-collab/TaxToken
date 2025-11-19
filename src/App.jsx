import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

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

  const isError = toast.type === 'error';

  return createPortal(
    (
      <AnimatePresence>
        {toast.show && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              pointerEvents: 'none'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(12px)',
                borderRadius: '0.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '24rem',
                width: 'clamp(220px, 90vw, 24rem)',
                padding: '1.25rem 1.5rem',
                border: isError ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(6, 182, 212, 0.5)',
                pointerEvents: 'auto'
              }}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                  {isError ? (
                    <FaExclamationCircle className="text-red-400 text-5xl" />
                  ) : (
                    <FaCheckCircle className="text-cyan-400 text-5xl" />
                  )}
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="text-white text-lg text-center">
                  {toast.message}
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    ),
    document.body
  );
}
;

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

// 动画路由包装组件
const AnimatedRoutes = () => {
  const location = useLocation();
  
  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.98 }
  };

  const pageTransition = {
    duration: 0.4,
    ease: "easeInOut"
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <HomePage />
          </motion.div>
        } />
        <Route path="/presale" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <PresalePage />
          </motion.div>
        } />
        <Route path="/swap" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <SwapPage />
          </motion.div>
        } />
        <Route path="/rewards" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <RewardsPage />
          </motion.div>
        } />
        <Route path="/admin" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AdminPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8 relative pb-24 md:pb-8">
      {/* 粒子背景 */}
      <ParticlesBackground />

      {/* Shared container for Header and all page content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {/* 头部 */}
        <Header />

        {/* 桌面导航 */}
        <DesktopNav />

        {/* 网络提示 */}
        <NetworkPrompt />

        {/* 主内容区 */}
        <main className="mt-8 md:mt-0 relative z-10">
          <AnimatedRoutes />
        </main>
      </div>

      {/* 移动端底部导航 */}
      <MobileBottomNav />

      {/* 全局提示 */}
      <GlobalToast />
    </div>
  );
}

export default App;
