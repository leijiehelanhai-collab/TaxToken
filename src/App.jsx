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
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                maxWidth: '24rem',
                width: 'clamp(280px, 88vw, 24rem)',
                padding: 'clamp(1.25rem, 4vw, 1.75rem)',
                border: isError ? '2px solid rgba(239, 68, 68, 0.6)' : '2px solid rgba(6, 182, 212, 0.6)',
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
    <div className="fixed top-0 left-0 right-0 z-[90] p-3 sm:p-4 animate-slide-down">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-md border border-yellow-500/40 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-xl shadow-yellow-500/20">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-yellow-300 mb-0.5 sm:mb-1">
                  {t('app.network_error_title')}
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-tight">
                  {t('app.current_network')}: <span className="text-yellow-300 font-semibold">{getNetworkName()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={switchToRequiredNetwork}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 active:scale-95 transition-all touch-manipulation whitespace-nowrap text-xs sm:text-sm shadow-lg flex-shrink-0"
            >
              {t('app.switch_to_testnet')}
            </button>
          </div>
        </div>
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
  const { chainId } = useWeb3();
  const isSupportedNetwork = chainId === 97 || chainId === 56;
  
  return (
    <div className="min-h-screen text-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 relative pb-20 sm:pb-24 md:pb-8">
      {/* 粒子背景 */}
      <ParticlesBackground />

      {/* 网络提示横幅 - 移到最顶部 */}
      <NetworkPrompt />

      {/* Shared container for Header and all page content */}
      <div className={`max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 transition-all duration-300 ${!isSupportedNetwork ? 'pt-20 sm:pt-24' : ''}`}>
        {/* 头部 */}
        <Header />

        {/* 桌面导航 */}
        <DesktopNav />

        {/* 主内容区 */}
        <main className="mt-4 sm:mt-6 md:mt-8 relative z-10">
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
