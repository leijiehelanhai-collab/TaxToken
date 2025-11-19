import { useWeb3 } from '../contexts/Web3Context';
import { FaChartLine, FaFire, FaCoins, FaUsers, FaCheckCircle, FaTimesCircle, FaGift } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { t } = useTranslation();
  const {
    userAddress,
    tokenBalance,
    buyTax,
    sellTax,
    tradingEnabled,
    presaleActive,
    isWhitelisted,
    presaleInfo
  } = useWeb3();

  const stats = [
    {
      icon: FaChartLine,
      label: t('home.stats.buy_tax'),
      value: `${(buyTax.rewardTax + buyTax.burnTax + buyTax.marketingTax)}%`,
      detail: t('home.stats.buy_detail', { reward: buyTax.rewardTax, burn: buyTax.burnTax, marketing: buyTax.marketingTax }),
      color: 'cyan'
    },
    {
      icon: FaFire,
      label: t('home.stats.sell_tax'),
      value: `${(sellTax.rewardTax + sellTax.burnTax + sellTax.marketingTax)}%`,
      detail: t('home.stats.sell_detail', { reward: sellTax.rewardTax, burn: sellTax.burnTax, marketing: sellTax.marketingTax }),
      color: 'orange'
    },
    {
      icon: FaCoins,
      label: t('home.stats.my_balance'),
      value: userAddress ? parseFloat(tokenBalance).toFixed(2) : '0',
      detail: t('home.stats.token_label'),
      color: 'green'
    },
    {
      icon: FaUsers,
      label: t('presale.whitelist'),
      value: presaleInfo?.isWhitelisted ? t('presale.whitelist_on') : t('presale.whitelist_off'),
      detail: presaleActive ? t('presale.status_on') : t('presale.status_off'),
      color: presaleInfo?.isWhitelisted ? 'green' : 'gray'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      cyan: 'from-cyan-500 to-cyan-600',
      orange: 'from-orange-500 to-orange-600',
      green: 'from-green-500 to-green-600',
      gray: 'from-gray-500 to-gray-600'
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <motion.div 
        className="glass-card p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
          {t('home.welcome_title')}
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          {t('home.welcome_subtitle')}
        </p>

        {/* 状态指示器 */}
        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            tradingEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {tradingEnabled ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{t('home.trading_status')} {tradingEnabled ? t('home.trading_on') : t('home.trading_off')}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            presaleActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {presaleActive ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{t('home.presale_status')} {presaleActive ? t('home.presale_on') : t('home.presale_off')}</span>
          </div>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${getColorClass(stat.color)} rounded-full flex items-center justify-center`}>
              <stat.icon className="text-white text-xl" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* 功能介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <FaCoins className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('home.features.presale_title')}</h3>
          <p className="text-gray-400 text-sm">{t('home.features.presale_desc')}</p>
        </motion.div>

        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
            <FaFire className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('home.features.tax_title')}</h3>
          <p className="text-gray-400 text-sm">
            {t('home.features.tax_desc')}
          </p>
        </motion.div>

        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <FaGift className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('home.features.lp_title')}</h3>
          <p className="text-gray-400 text-sm">{t('home.features.lp_desc')}</p>
        </motion.div>
      </div>

      {/* 快速操作 */}
      {userAddress && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">{t('home.quick.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/presale" className="btn-primary text-center block">{t('home.quick.presale')}</a>
            <a href="/rewards" className="btn-primary text-center block">{t('home.quick.rewards')}</a>
            <a href="/admin" className="btn-secondary text-center block">{t('home.quick.admin')}</a>
          </div>
        </div>
      )}
    </div>
  );
}
