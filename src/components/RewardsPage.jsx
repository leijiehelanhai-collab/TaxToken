import { useWeb3 } from '../contexts/Web3Context';
import { FaGift, FaCoins, FaChartPie, FaHistory, FaInfoCircle } from 'react-icons/fa';
import { CONTRACT_ADDRESS } from '../constants';
import { useTranslation } from 'react-i18next';

export default function RewardsPage() {
  const {
    userAddress,
    lpInfo,
    claimRewards,
    loading,
    chainId
  } = useWeb3();
  const { t } = useTranslation();

  // 根据网络动态生成 PancakeSwap 添加流动性的链接
  const addLiquidityUrl = chainId === 97
    ? `https://pancakeswap.finance/add?chain=bscTestnet`
    : `https://pancakeswap.finance/add?chain=bsc`;

  if (!userAddress) {
    return (
      <div className="glass-card p-12 text-center max-w-2xl mx-auto">
        <FaInfoCircle className="text-6xl text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">{t('rewards.connect_first_title')}</h2>
        <p className="text-gray-400">{t('rewards.connect_first_desc')}</p>
      </div>
    );
  }

  const hasLPTokens = lpInfo && parseFloat(lpInfo.lpBalance) > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* 页面标题 */}
      <div className="glass-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <FaGift className="text-white text-lg sm:text-xl" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('rewards.title')}</h2>
            <p className="text-gray-400 text-xs sm:text-sm">{t('rewards.subtitle')}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-300">
            <FaInfoCircle className="inline mr-2 text-cyan-400 text-sm sm:text-base" />
            {t('rewards.tip')}
          </p>
        </div>
      </div>

      {hasLPTokens ? (
        <>
          {/* LP 信息卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="glass-card p-4 sm:p-5 md:p-6 text-center">
              <FaCoins className="text-2xl sm:text-3xl text-cyan-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('rewards.lp_balance')}</p>
              <p className="text-xl sm:text-2xl font-bold text-white break-words">
                {parseFloat(lpInfo.lpBalance).toFixed(4)}
              </p>
            </div>

            <div className="glass-card p-4 sm:p-5 md:p-6 text-center">
              <FaChartPie className="text-2xl sm:text-3xl text-purple-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('rewards.lp_share')}</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {lpInfo.lpPercentage.toFixed(4)}%
              </p>
            </div>

            <div className="glass-card p-4 sm:p-5 md:p-6 text-center">
              <FaGift className="text-2xl sm:text-3xl text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('rewards.claimable')}</p>
              <p className="text-xl sm:text-2xl font-bold text-green-400 break-words">
                {parseFloat(lpInfo.estimatedRewards).toFixed(6)} BNB
              </p>
            </div>

            <div className="glass-card p-4 sm:p-5 md:p-6 text-center">
              <FaHistory className="text-2xl sm:text-3xl text-orange-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{t('rewards.current_claimable')}</p>
              <p className="text-xl sm:text-2xl font-bold text-white break-words">
                {parseFloat(lpInfo.totalClaimed).toFixed(6)} BNB
              </p>
            </div>
          </div>

          {/* 领取奖励卡片 */}
          <div className="glass-card p-4 sm:p-5 md:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{t('rewards.claim_title')}</h3>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">{t('rewards.current_claimable')}</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-400 mb-3 sm:mb-4 break-words">
                {parseFloat(lpInfo.estimatedRewards).toFixed(6)} BNB
              </p>
              <p className="text-gray-500 text-xs">
                {t('rewards.usd_hint', { usd: (parseFloat(lpInfo.estimatedRewards) * 600).toFixed(2), price: 600 })}
              </p>
            </div>

            <button
              onClick={claimRewards}
              disabled={loading || parseFloat(lpInfo.estimatedRewards) <= 0}
              className="btn-primary w-full flex items-center justify-center gap-2 touch-manipulation min-h-[44px] text-sm sm:text-base"
            >
              <FaGift />
              <span>
                {loading ? t('common.processing') :
                 parseFloat(lpInfo.estimatedRewards) <= 0 ? t('rewards.no_rewards') : t('rewards.claim_title')}
              </span>
            </button>

            {parseFloat(lpInfo.estimatedRewards) <= 0 && (
              <p className="text-gray-500 text-xs sm:text-sm text-center mt-3">{t('rewards.no_rewards_tip')}</p>
            )}
          </div>

          {/* 奖励机制说明 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">{t('rewards.howto_title')}</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">1</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{t('rewards.howto_1_title')}</p>
                  <p>{t('rewards.howto_1_desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">2</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{t('rewards.howto_2_title')}</p>
                  <p>{t('rewards.howto_2_desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">3</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{t('rewards.howto_3_title')}</p>
                  <p>{t('rewards.howto_3_desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-xs">4</span>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{t('rewards.howto_4_title')}</p>
                  <p>{t('rewards.howto_4_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 无LP代币提示 */
        <div className="glass-card p-12 text-center">
          <FaCoins className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{t('rewards.no_lp_title')}</h3>
          <p className="text-gray-400 mb-6">{t('rewards.no_lp_desc')}</p>

          <div className="max-w-md mx-auto space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg text-left">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs">1</span>
                {t('rewards.howto_1_title')}
              </h4>
              <p className="text-gray-400 text-sm">{t('rewards.howto_3_desc')}</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-left">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs">2</span>
                {t('rewards.go_add_liquidity')}
              </h4>
              <p className="text-gray-400 text-sm">{t('rewards.no_lp_desc')}</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-left">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs">3</span>
                {t('rewards.title')}
              </h4>
              <p className="text-gray-400 text-sm">{t('rewards.subtitle')}</p>
            </div>

            <a
              href={addLiquidityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full block text-center mt-6"
            >
              {t('rewards.go_add_liquidity')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
