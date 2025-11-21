import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { FaShoppingCart, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FloatingOrb, CoinAnimation, GridPattern, WaveLine } from './DecorativeShapes';

export default function PresalePage() {
  const { t } = useTranslation();
  const {
    userAddress,
    bnbBalance,
    presaleInfo,
    presaleActive,
    buyPresale,
    loading
  } = useWeb3();

  const [bnbAmount, setBnbAmount] = useState('');

  const handleBuyPresale = async () => {
    if (!bnbAmount || parseFloat(bnbAmount) <= 0) {
      alert(t('presale.errors.enter_valid_bnb'));
      return;
    }

    if (parseFloat(bnbAmount) > parseFloat(bnbBalance)) {
      alert(t('presale.errors.insufficient_bnb'));
      return;
    }

    await buyPresale(bnbAmount);
    setBnbAmount('');
  };

  const calculateTokens = (bnb) => {
    // 假设预售价格：1 BNB = 10,000 TAX
    const tokens = parseFloat(bnb) * 10000;
    return tokens.toFixed(0);
  };

  if (!userAddress) {
    return (
      <div className="glass-card p-12 text-center max-w-2xl mx-auto relative overflow-hidden">
        <GridPattern className="opacity-20" />
        <FloatingOrb className="-top-10 -right-10" color="cyan" size="md" />
        <div className="relative z-10">
          <FaInfoCircle className="text-6xl text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('presale.connect_first_title')}</h2>
          <p className="text-gray-400">{t('presale.connect_first_desc')}</p>
        </div>
        <WaveLine className="absolute bottom-0 left-0 opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* 预售状态 */}
      <motion.div 
        className="glass-card p-4 sm:p-5 md:p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 装饰背景 */}
        <FloatingOrb className="top-0 right-0" color="purple" size="sm" delay={0.5} />
        <div className="absolute top-10 left-10 w-32 h-32 opacity-50">
          <CoinAnimation />
        </div>
        <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{t('presale.title')}</h2>
          <div className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
            presaleActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {presaleActive ? <FaCheckCircle className="text-base sm:text-lg" /> : <FaTimesCircle className="text-base sm:text-lg" />}
            <span>{presaleActive ? t('presale.status_on') : t('presale.status_off')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-slate-900/50 p-3 sm:p-4 rounded-lg">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('presale.price')}</p>
            <p className="text-lg sm:text-xl font-bold text-cyan-400 break-words">1 BNB = 10,000 TAX</p>
          </div>
          <div className="bg-slate-900/50 p-3 sm:p-4 rounded-lg">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('presale.min')}</p>
            <p className="text-lg sm:text-xl font-bold text-cyan-400">0.01 BNB</p>
          </div>
          <div className="bg-slate-900/50 p-3 sm:p-4 rounded-lg">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('presale.accept')}</p>
            <p className="text-lg sm:text-xl font-bold text-cyan-400">BNB</p>
          </div>
        </div>

        {presaleInfo && (
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{t('presale.my_info')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('presale.whitelist')}</p>
                <p className={`font-semibold text-sm sm:text-base ${presaleInfo.isWhitelisted ? 'text-green-400' : 'text-red-400'}`}>
                  {presaleInfo.isWhitelisted ? t('presale.whitelist_on') : t('presale.whitelist_off')}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('presale.allocation')}</p>
                <p className="text-white font-semibold text-sm sm:text-base break-words">{parseFloat(presaleInfo.allocation).toFixed(0)} TAX</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('presale.purchased')}</p>
                <p className="text-white font-semibold text-sm sm:text-base break-words">{parseFloat(presaleInfo.purchased).toFixed(0)} TAX</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('presale.remaining')}</p>
                <p className="text-cyan-400 font-semibold text-sm sm:text-base break-words">{parseFloat(presaleInfo.remaining).toFixed(0)} TAX</p>
              </div>
            </div>
          </div>
        )}
        </div>
      </motion.div>

      {/* 购买表单 */}
      {presaleActive && presaleInfo?.isWhitelisted ? (
        <motion.div 
          className="glass-card p-4 sm:p-5 md:p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GridPattern className="opacity-10" />
          <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">{t('presale.buy_title')}</h3>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-2">{t('presale.input_bnb')}</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={bnbAmount}
                  onChange={(e) => setBnbAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field pr-16 sm:pr-20 text-sm sm:text-base min-h-[44px]"
                />
                <button
                  onClick={() => setBnbAmount(bnbBalance)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 sm:px-3 py-1.5 sm:py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs sm:text-sm hover:bg-cyan-500/30 transition-all touch-manipulation min-h-[36px]"
                >
                  {t('presale.max')}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {t('common.available_balance')}: {parseFloat(bnbBalance).toFixed(4)} BNB
              </p>
            </div>

            {bnbAmount && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('presale.you_will_get')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-cyan-400 break-words">
                  {calculateTokens(bnbAmount)} TAX
                </p>
              </div>
            )}

            <button
              onClick={handleBuyPresale}
              disabled={loading || !bnbAmount || parseFloat(bnbAmount) <= 0}
              className="btn-primary w-full flex items-center justify-center gap-2 touch-manipulation min-h-[44px] text-sm sm:text-base"
            >
              <FaShoppingCart />
              <span>{loading ? t('common.processing') : t('presale.buy_button')}</span>
            </button>
          </div>
          </div>
        </motion.div>
      ) : presaleActive && !presaleInfo?.isWhitelisted ? (
        <div className="glass-card p-8 sm:p-10 md:p-12 text-center">
          <FaTimesCircle className="text-4xl sm:text-5xl md:text-6xl text-red-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('presale.not_in_whitelist_title')}</h3>
          <p className="text-gray-400 text-sm sm:text-base">{t('presale.not_in_whitelist_desc')}</p>
        </div>
      ) : (
        <div className="glass-card p-8 sm:p-10 md:p-12 text-center">
          <FaInfoCircle className="text-4xl sm:text-5xl md:text-6xl text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('presale.not_started_title')}</h3>
          <p className="text-gray-400 text-sm sm:text-base">{t('presale.not_started_desc')}</p>
        </div>
      )}

      {/* 预售说明 */}
      <motion.div 
        className="glass-card p-4 sm:p-5 md:p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <WaveLine className="absolute bottom-0 left-0 opacity-20" />
        <div className="relative z-10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{t('presale.guide_title')}</h3>
        <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-cyan-400 mt-0.5 sm:mt-1 flex-shrink-0 text-xs sm:text-sm" />
            <span>{t('presale.guide_1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-cyan-400 mt-0.5 sm:mt-1 flex-shrink-0 text-xs sm:text-sm" />
            <span>{t('presale.guide_2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-cyan-400 mt-0.5 sm:mt-1 flex-shrink-0 text-xs sm:text-sm" />
            <span>{t('presale.guide_3')}</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-cyan-400 mt-0.5 sm:mt-1 flex-shrink-0 text-xs sm:text-sm" />
            <span>{t('presale.guide_4')}</span>
          </li>
        </ul>
        </div>
      </motion.div>
    </div>
  );
}
