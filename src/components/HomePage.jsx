import { useWeb3 } from '../contexts/Web3Context';
import { FaChartLine, FaFire, FaCoins, FaUsers, FaCheckCircle, FaTimesCircle, FaGift, FaRocket, FaShieldAlt, FaTrophy, FaCog } from 'react-icons/fa';
import { 
  SiAdobe, SiStripe, SiHubspot, SiGithub, SiGoogle, SiSpotify, SiCanva, SiWhatsapp,
  SiGrammarly, SiLinear, SiCoinbase, SiWebflow, SiInstagram, SiMailchimp, SiGitlab, SiNotion,
  SiMedium, SiAtlassian, SiDribbble, SiGumroad, SiSlack, SiUber,
  SiDropbox, SiTinder, SiZoom, SiAsana
} from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    presaleInfo,
    stats: statsData
  } = useWeb3();

  // 格式化数字显示
  const formatNumber = (num) => {
    const n = parseFloat(num);
    if (isNaN(n) || n === 0) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(2) + 'K';
    return n.toFixed(2);
  };

  const stats = [
    {
      icon: FaCoins,
      label: t('home.stats.total_supply'),
      value: formatNumber(statsData.totalSupply),
      detail: t('home.stats.total_supply_detail'),
      color: 'cyan'
    },
    {
      icon: FaChartLine,
      label: t('home.stats.holders'),
      value: statsData.holders > 0 ? statsData.holders.toLocaleString() : '...',
      detail: t('home.stats.holders_detail'),
      color: 'green'
    },
    {
      icon: FaFire,
      label: t('home.stats.total_volume'),
      value: formatNumber(statsData.totalVolume),
      detail: t('home.stats.total_volume_detail'),
      color: 'orange'
    },
    {
      icon: FaTrophy,
      label: t('home.stats.lp_rewards'),
      value: formatNumber(statsData.totalRewards),
      detail: t('home.stats.lp_rewards_detail'),
      color: 'purple'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      cyan: 'from-cyan-500 to-cyan-600',
      orange: 'from-orange-500 to-orange-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      gray: 'from-gray-500 to-gray-600'
    };
    return colors[color] || colors.cyan;
  };

  const partners = [
    { name: 'Adobe', icon: SiAdobe },
    { name: 'Stripe', icon: SiStripe },
    { name: 'HubSpot', icon: SiHubspot },
    { name: 'GitHub', icon: SiGithub },
    { name: 'Google', icon: SiGoogle },
    { name: 'Spotify', icon: SiSpotify },
    { name: 'Canva', icon: SiCanva },
    { name: 'WhatsApp', icon: SiWhatsapp },
    { name: 'grammarly', icon: SiGrammarly },
    { name: 'Linear', icon: SiLinear },
    { name: 'coinbase', icon: SiCoinbase },
    { name: 'webflow', icon: SiWebflow },
    { name: 'Instagram', icon: SiInstagram },
    { name: 'mailchimp', icon: SiMailchimp },
    { name: 'GitLab', icon: SiGitlab },
    { name: 'Notion', icon: SiNotion },
    { name: 'Medium', icon: SiMedium },
    { name: 'ATLAS SIAN', icon: SiAtlassian },
    { name: 'dribbble', icon: SiDribbble },
    { name: 'GUMROAD', icon: SiGumroad },
    { name: 'slack', icon: SiSlack },
    { name: 'Uber', icon: SiUber },
    { name: 'Dropbox', icon: SiDropbox },
    { name: 'tinder', icon: SiTinder },
    { name: 'zoom', icon: SiZoom },
    { name: 'asana', icon: SiAsana },
  ];

  const getBrandClass = (name) => {
    const strong = ['IBM', 'Microsoft', 'Google', 'GitHub', 'Stripe', 'Spotify'];
    const mono = ['IBM'];
    const uppercase = ['IBM', 'GUMROAD', 'ATLAS SIAN'];
    let cls = 'text-white/90';
    if (strong.includes(name)) cls += ' font-extrabold';
    else cls += ' font-semibold';
    if (mono.includes(name)) cls += ' tracking-wide';
    if (uppercase.includes(name)) cls += ' uppercase';
    return cls;
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.div
        className="glass-card p-10 md:p-12 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-600/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center font-bold text-2xl shadow-2xl shadow-cyan-500/30">
            <span className="tracking-tight text-white">TAX</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-6">
            {t('home.hero_title')}
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('home.hero_subtitle')}
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 text-sm mb-8">
            <motion.div
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold backdrop-blur-sm ${
                tradingEnabled ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {tradingEnabled ? <FaCheckCircle className="text-lg" /> : <FaTimesCircle className="text-lg" />}
              <span>{t('home.trading_status')} {tradingEnabled ? t('home.trading_on') : t('home.trading_off')}</span>
            </motion.div>
            <motion.div
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold backdrop-blur-sm ${
                presaleActive ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {presaleActive ? <FaCheckCircle className="text-lg" /> : <FaTimesCircle className="text-lg" />}
              <span>{t('home.presale_status')} {presaleActive ? t('home.presale_on') : t('home.presale_off')}</span>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <motion.button
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket className="mr-2" />
              {t('home.get_started')}
            </motion.button>
            <motion.button
              className="btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShieldAlt className="mr-2" />
              {t('home.learn_more')}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className={`w-14 h-14 mx-auto mb-5 bg-gradient-to-br ${getColorClass(stat.color)} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                <stat.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wide">{stat.label}</h3>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 功能介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="glass-card p-8 group relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
              <FaRocket className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('home.features.fair_presale_title')}</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-4">
              {t('home.features.fair_presale_desc')}
            </p>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-400 text-xs" />
                {t('home.features.fair_presale_feature1')}
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-400 text-xs" />
                {t('home.features.fair_presale_feature2')}
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-400 text-xs" />
                {t('home.features.fair_presale_feature3')}
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-8 group relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <FaFire className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('home.features.smart_tax_title')}</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-4">
              {t('home.features.smart_tax_desc')}
            </p>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-purple-400 text-xs" />
                {t('home.features.smart_tax_feature1')}
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-purple-400 text-xs" />
                {t('home.features.smart_tax_feature2')}
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-purple-400 text-xs" />
                {t('home.features.smart_tax_feature3')}
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-8 group relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <FaGift className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('home.features.lp_rewards_title')}</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-4">
              {t('home.features.lp_rewards_desc')}
            </p>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400 text-xs" />
                {t('home.features.lp_rewards_feature1')}
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400 text-xs" />
                {t('home.features.lp_rewards_feature2')}
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400 text-xs" />
                {t('home.features.lp_rewards_feature3')}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* 快速操作 */}
      {userAddress && (
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">{t('home.quick.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/presale" className="btn-primary text-center block py-4 text-lg font-semibold">
              <FaRocket className="inline mr-2" />
              {t('home.quick.presale')}
            </Link>
            <Link to="/rewards" className="btn-primary text-center block py-4 text-lg font-semibold">
              <FaGift className="inline mr-2" />
              {t('home.quick.rewards')}
            </Link>
            <Link to="/admin" className="btn-secondary text-center block py-4 text-lg font-semibold">
              <FaCog className="inline mr-2" />
              {t('home.quick.admin')}
            </Link>
          </div>
        </div>
      )}

      {/* 核心价值（在 Technology 之上） */}
      <motion.section
        className="relative overflow-hidden rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="bg-gradient-to-b from-violet-700/40 via-purple-700/30 to-indigo-800/30 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-purple-200/90 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-300" />
              <span className="text-xs tracking-widest uppercase">{t('home.core.chip')}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">{t('home.core.title')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <FaShieldAlt className="text-purple-300" />
              </div>
              <h4 className="text-white font-bold mb-1">{t('home.core.transparent_title')}</h4>
              <p className="text-gray-300 text-sm">{t('home.core.transparent_desc')}</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <FaGift className="text-purple-300" />
              </div>
              <h4 className="text-white font-bold mb-1">{t('home.core.sustainable_title')}</h4>
              <p className="text-gray-300 text-sm">{t('home.core.sustainable_desc')}</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <FaCog className="text-purple-300" />
              </div>
              <h4 className="text-white font-bold mb-1">{t('home.core.governance_title')}</h4>
              <p className="text-gray-300 text-sm">{t('home.core.governance_desc')}</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <FaCoins className="text-purple-300" />
              </div>
              <h4 className="text-white font-bold mb-1">{t('home.core.ecosystem_title')}</h4>
              <p className="text-gray-300 text-sm">{t('home.core.ecosystem_desc')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 能力版块（在 Technology 之上） */}
      <motion.section
        className="relative glass-card p-8 md:p-10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-cyan-200/90 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-300" />
            <span className="text-xs tracking-widest uppercase">{t('home.capabilities.chip')}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">{t('home.capabilities.title')}</h3>
          <p className="text-gray-300 mt-2">{t('home.capabilities.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/10">
            <div className="w-12 h-12 mb-4 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <FaChartLine className="text-cyan-300" />
            </div>
            <h4 className="text-white font-bold mb-1">{t('home.capabilities.data_insight_title')}</h4>
            <p className="text-gray-300 text-sm">{t('home.capabilities.data_insight_desc')}</p>
          </div>
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/10">
            <div className="w-12 h-12 mb-4 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <FaFire className="text-orange-300" />
            </div>
            <h4 className="text-white font-bold mb-1">{t('home.capabilities.dynamic_tax_title')}</h4>
            <p className="text-gray-300 text-sm">{t('home.capabilities.dynamic_tax_desc')}</p>
          </div>
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/10">
            <div className="w-12 h-12 mb-4 rounded-xl bg-green-500/20 flex items-center justify-center">
              <FaUsers className="text-green-300" />
            </div>
            <h4 className="text-white font-bold mb-1">{t('home.capabilities.reputation_title')}</h4>
            <p className="text-gray-300 text-sm">{t('home.capabilities.reputation_desc')}</p>
          </div>
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/10">
            <div className="w-12 h-12 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FaTrophy className="text-purple-300" />
            </div>
            <h4 className="text-white font-bold mb-1">{t('home.capabilities.lp_auto_title')}</h4>
            <p className="text-gray-300 text-sm">{t('home.capabilities.lp_auto_desc')}</p>
          </div>
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/10 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 mb-4 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <FaRocket className="text-pink-300" />
            </div>
            <h4 className="text-white font-bold mb-1">{t('home.capabilities.ecosystem_title')}</h4>
            <p className="text-gray-300 text-sm">{t('home.capabilities.ecosystem_desc')}</p>
          </div>
        </div>
      </motion.section>

      {/* 合作伙伴 - 页面底部 */}
      {/* Technology Section (moved) */}
      <motion.section
        className="glass-card p-8 md:p-10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 text-cyan-300/90 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-sm tracking-wider uppercase">{t('home.tech.chip')}</span>
              <div className="h-px w-10 bg-cyan-400/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              {t('home.tech.heading_prefix')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"> {t('home.tech.heading_suffix')}</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">{t('home.tech.desc')}</p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-indigo-900/60 to-purple-900/40 border border-purple-500/40">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-purple-400/20" />
              <div className="w-16 h-16 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center overflow-hidden">
                <img src="/robot-CAdUVStE.png" alt={t('home.tech.card1_alt')} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('home.tech.card1_title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t('home.tech.card1_desc')}</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-indigo-900/60 to-purple-900/40 border border-purple-500/40">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-purple-400/20" />
              <div className="w-16 h-16 mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center overflow-hidden">
                <img src="/Vector-QbrWoUfm.png" alt={t('home.tech.card2_alt')} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('home.tech.card2_title')}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t('home.tech.card2_desc')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Future Vision Section (moved) */}
      <motion.section
        className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <div className="relative mx-auto w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-purple-600/40 to-indigo-600/30 blur-2xl" />
          <div className="absolute inset-0 rounded-full border border-purple-400/40" />
          <div className="absolute inset-6 rounded-full border border-purple-400/30" />
          <div className="absolute inset-12 rounded-full border border-purple-400/20" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center overflow-hidden">
            <img src="/Group1000007192-BK8yUpor.svg" alt={t('home.future.ai_alt')} className="w-4/5 h-4/5 object-contain" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-purple-300/90 mb-3 justify-end lg:justify-start">
            <div className="h-px w-10 bg-purple-400/40" />
            <span className="text-sm tracking-wider uppercase">{t('home.future.chip')}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">{t('home.future.title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300">{t('home.future.title_highlight')}</span> {t('home.future.title_suffix')}</h3>
          <p className="text-gray-300 leading-relaxed">{t('home.future.desc')}</p>
        </div>
      </motion.section>
      <motion.div
        className="rounded-2xl overflow-hidden border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-800 p-8 md:p-12">
          <h3 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-8">{t('home.partners.title')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-6 md:gap-y-8 place-items-start md:place-items-center">
            {partners.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                {p.icon ? (
                  <p.icon className="text-white/80 group-hover:text-white transition-colors duration-200 text-2xl md:text-3xl" />
                ) : (
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors duration-200" />
                )}
                <span className={`${getBrandClass(p.name)} text-lg md:text-xl group-hover:text-white transition-colors duration-200`}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
