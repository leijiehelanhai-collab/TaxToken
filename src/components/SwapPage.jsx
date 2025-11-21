import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSyncAlt, FaExchangeAlt, FaCog, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import PriceChart from './PriceChart';
import { FloatingOrb, GridPattern, DataVisualization, CubeIcon } from './DecorativeShapes';

export default function SwapPage() {
  const { t } = useTranslation();
  const {
    userAddress,
    bnbBalance,
    tokenBalance,
    swapBNBForTokens,
    swapTokensForBNB,
    approveTokenForSwap,
    getSwapQuote,
    loading
  } = useWeb3();

  const [fromToken, setFromToken] = useState('BNB');
  const [toToken, setToToken] = useState('TAX');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approving, setApproving] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);

  // 计算价格和兑换金额
  useEffect(() => {
    const calculateSwap = async () => {
      if (!fromAmount || isNaN(fromAmount) || parseFloat(fromAmount) <= 0) {
        setToAmount('');
        return;
      }

      try {
        const quote = await getSwapQuote(fromToken, toToken, fromAmount);
        if (quote) {
          setToAmount(quote.outputAmount);
          setPriceImpact(quote.priceImpact || 0);

          // 检查是否需要授权（仅当从TAX兑换到BNB时）
          if (fromToken === 'TAX') {
            setNeedsApproval(!quote.hasAllowance);
          } else {
            setNeedsApproval(false);
          }
        }
      } catch (error) {
        console.error('计算兑换失败:', error);
      }
    };

    const timer = setTimeout(calculateSwap, 500);
    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken, getSwapQuote]);

  // 切换代币方向
  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount('');
  };

  // 设置最大金额
  const handleMaxAmount = () => {
    if (fromToken === 'BNB') {
      // 保留一点 BNB 作为 gas 费用
      const maxBnb = Math.max(0, parseFloat(bnbBalance) - 0.001);
      setFromAmount(maxBnb.toFixed(6));
    } else {
      setFromAmount(tokenBalance);
    }
  };

  // 授权代币
  const handleApprove = async () => {
    try {
      setApproving(true);
      await approveTokenForSwap();
      setNeedsApproval(false);
    } catch (error) {
      console.error('授权失败:', error);
    } finally {
      setApproving(false);
    }
  };

  // 执行兑换
  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    try {
      setSwapping(true);
      if (fromToken === 'BNB') {
        await swapBNBForTokens(fromAmount, slippage);
      } else {
        await swapTokensForBNB(fromAmount, slippage);
      }
      // 清空输入
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('兑换失败:', error);
    } finally {
      setSwapping(false);
    }
  };

  // 获取当前余额
  const getCurrentBalance = () => {
    return fromToken === 'BNB' ? bnbBalance : tokenBalance;
  };

  // 检查余额是否足够
  const hasInsufficientBalance = () => {
    if (!fromAmount) return false;
    const balance = parseFloat(getCurrentBalance());
    const amount = parseFloat(fromAmount);
    return amount > balance;
  };

  // 如果未连接钱包
  if (!userAddress) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 text-center relative overflow-hidden">
          <GridPattern className="opacity-20" />
          <FloatingOrb className="top-0 -left-10" color="cyan" size="md" />
          <FloatingOrb className="bottom-0 -right-10" color="purple" size="sm" delay={0.5} />
          <div className="relative z-10">
            <FaSyncAlt className="text-6xl text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2 text-gradient">
              {t('swap.connect_first_title')}
            </h2>
            <p className="text-gray-400">{t('swap.connect_first_desc')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 标题区域 */}
      <motion.div 
        className="text-center mb-4 sm:mb-6 md:mb-8 px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-gradient">
          {t('swap.title')}
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg">{t('swap.subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:items-start">
        {/* 主交换面板 */}
        <div className="lg:col-span-2 flex flex-col">
          <motion.div
            className="glass-card p-4 sm:p-5 md:p-6 swap-card flex-1 flex flex-col relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0 20px 40px rgba(6, 182, 212, 0.15)",
              transition: { duration: 0.2 }
            }}
          >
            {/* 装饰性背景 */}
            <GridPattern className="opacity-10" />
            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
              <CubeIcon />
            </div>
            <FloatingOrb className="-bottom-10 -left-10" color="green" size="sm" delay={1} />
            
            <div className="flex-1 flex flex-col relative z-10">
              {/* 设置按钮 */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold">{t('swap.title')}</h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('swap.settings')}
              >
                <FaCog className={`text-gray-400 transition-transform text-base sm:text-lg ${showSettings ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* 滑点设置 */}
            {showSettings && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700/30 rounded-lg border border-cyan-500/20 animate-slideDown">
                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-300">
                  {t('swap.slippage')}: {slippage}%
                </label>
                <div className="flex flex-wrap gap-2">
                  {[0.5, 1, 3, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation min-h-[44px] ${
                        slippage === value
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                    className="input-field flex-1 min-w-[80px] text-center text-xs sm:text-sm min-h-[44px]"
                    placeholder={t('swap.slippage_auto')}
                  />
                </div>
              </div>
            )}

            {/* From 代币输入 */}
            <div className="mb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                <label className="text-xs sm:text-sm text-gray-400">{t('swap.from')}</label>
                <span className="text-xs sm:text-sm text-gray-400 break-all sm:break-normal">
                  {t('swap.balance')}: {getCurrentBalance()} {fromToken}
                </span>
              </div>
              <div className="swap-input-card">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="swap-input"
                />
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={handleMaxAmount}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors touch-manipulation min-h-[36px] whitespace-nowrap"
                  >
                    {t('swap.max')}
                  </button>
                  <div className="token-select">
                    {fromToken === 'BNB' ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 flex items-center justify-center shadow-sm flex-shrink-0">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          viewBox="0 0 256 256"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#F3BA2F"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M127.9 24L86.3 65.6l21.6 21.6 20-20 20 20 21.6-21.6L127.9 24zM65.6 86.3L24 127.9l21.6 21.6 41.6-41.6-21.6-21.6zm124.6 0l-21.6 21.6 41.6 41.6 21.6-21.6-41.6-41.6zM127.9 108.7l-19.2 19.2 19.2 19.2 19.2-19.2-19.2-19.2zM86.3 170.3l-21.6 21.6 41.6 41.6 21.6-21.6-41.6-41.6zm82.9 0l-41.6 41.6 21.6 21.6 41.6-41.6-21.6-21.6z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-[9px] sm:text-[10px] font-black tracking-tight flex items-center justify-center leading-none shadow-sm ring-1 ring-cyan-400/30 flex-shrink-0">TAX</div>
                    )}
                    <span className="font-bold text-sm sm:text-base whitespace-nowrap">{fromToken}</span>
                    <FaChevronDown className="text-gray-400 text-xs sm:text-sm flex-shrink-0" />
                  </div>
                </div>
              </div>
              {hasInsufficientBalance() && (
                <p className="text-red-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
                  {t('swap.insufficient_balance', { token: fromToken })}
                </p>
              )}
            </div>

            {/* 交换按钮 */}
            <div className="flex justify-center my-2 sm:my-3 md:my-4">
              <button
                onClick={handleSwapDirection}
                className="swap-direction-btn touch-manipulation min-w-[44px] min-h-[44px] p-3 sm:p-4"
                aria-label={t('swap.swap_direction')}
              >
                <FaExchangeAlt className="text-lg sm:text-xl" />
              </button>
            </div>

            {/* To 代币输入 */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                <label className="text-xs sm:text-sm text-gray-400">{t('swap.to')}</label>
                <span className="text-xs sm:text-sm text-gray-400 break-all sm:break-normal">
                  {t('swap.balance')}: {toToken === 'BNB' ? bnbBalance : tokenBalance} {toToken}
                </span>
              </div>
              <div className="swap-input-card">
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="swap-input"
                />
                <div className="token-select">
                  {toToken === 'BNB' ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 flex items-center justify-center shadow-sm flex-shrink-0">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        viewBox="0 0 256 256"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#F3BA2F"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M127.9 24L86.3 65.6l21.6 21.6 20-20 20 20 21.6-21.6L127.9 24zM65.6 86.3L24 127.9l21.6 21.6 41.6-41.6-21.6-21.6zm124.6 0l-21.6 21.6 41.6 41.6 21.6-21.6-41.6-41.6zM127.9 108.7l-19.2 19.2 19.2 19.2 19.2-19.2-19.2-19.2zM86.3 170.3l-21.6 21.6 41.6 41.6 21.6-21.6-41.6-41.6zm82.9 0l-41.6 41.6 21.6 21.6 41.6-41.6-21.6-21.6z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-[9px] sm:text-[10px] font-black tracking-tight flex items-center justify-center leading-none shadow-sm ring-1 ring-cyan-400/30 flex-shrink-0">TAX</div>
                  )}
                  <span className="font-bold text-sm sm:text-base whitespace-nowrap">{toToken}</span>
                  <FaChevronDown className="text-gray-400 text-xs sm:text-sm flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* 交易信息 */}
            {toAmount && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700/20 rounded-lg border border-cyan-500/10 space-y-1.5 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                  <span className="text-gray-400">{t('swap.exchange_rate')}</span>
                  <span className="text-white font-medium break-all sm:break-normal">
                    1 {fromToken} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken}
                  </span>
                </div>
                {priceImpact > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                    <span className="text-gray-400">{t('swap.price_impact')}</span>
                    <span className={`font-medium ${priceImpact > 5 ? 'text-red-400' : 'text-green-400'}`}>
                      {priceImpact.toFixed(2)}%
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                  <span className="text-gray-400">{t('swap.minimum_received')}</span>
                  <span className="text-white font-medium break-all sm:break-normal">
                    {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                  <span className="text-gray-400">{t('swap.route')}</span>
                  <span className="text-cyan-400 font-medium">{t('swap.direct')}</span>
                </div>
              </div>
            )}

              {/* 操作按钮 */}
              <div className="mt-auto">
                {needsApproval ? (
                  <button
                    onClick={handleApprove}
                    disabled={approving || loading}
                    className="btn-primary w-full touch-manipulation min-h-[44px] text-sm sm:text-base"
                  >
                    {approving ? t('swap.approving') : t('swap.approve_button', { token: fromToken })}
                  </button>
                ) : (
                  <button
                    onClick={handleSwap}
                    disabled={swapping || loading || !fromAmount || hasInsufficientBalance() || !toAmount}
                    className="btn-primary w-full touch-manipulation min-h-[44px] text-sm sm:text-base"
                  >
                    {swapping ? t('swap.swapping') : t('swap.swap_button')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 侧边信息面板 */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-5 lg:space-y-6">
          {/* 功能特性 */}
          <motion.div 
            className="glass-card p-4 sm:p-5 md:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 15px 30px rgba(6, 182, 212, 0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-gradient">
              {t('swap.features.instant_title')}
            </h3>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="feature-item">
                <div className="feature-icon w-10 h-10 sm:w-12 sm:h-12">
                  <FaSyncAlt className="text-cyan-400 text-base sm:text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{t('swap.features.instant_title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{t('swap.features.instant_desc')}</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon w-10 h-10 sm:w-12 sm:h-12">
                  <FaInfoCircle className="text-blue-400 text-base sm:text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{t('swap.features.low_fees_title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{t('swap.features.low_fees_desc')}</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon w-10 h-10 sm:w-12 sm:h-12">
                  <FaExchangeAlt className="text-purple-400 text-base sm:text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{t('swap.features.liquidity_title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{t('swap.features.liquidity_desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 使用说明 */}
          <motion.div 
            className="glass-card p-4 sm:p-5 md:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 15px 30px rgba(6, 182, 212, 0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-gradient flex items-center gap-2">
              <FaInfoCircle className="text-base sm:text-lg" />
              {t('swap.info.title')}
            </h3>
            <ol className="space-y-2 sm:space-y-2.5 lg:space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
                  1
                </span>
                <span>{t('swap.info.step1')}</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
                  2
                </span>
                <span>{t('swap.info.step2')}</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
                  3
                </span>
                <span>{t('swap.info.step3')}</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
                  4
                </span>
                <span>{t('swap.info.step4')}</span>
              </li>
            </ol>
          </motion.div>
        </div>
      </div>

      {/* 价格走势图 */}
      <motion.div
        className="mt-6 sm:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <PriceChart />
      </motion.div>
    </div>
  );
}
