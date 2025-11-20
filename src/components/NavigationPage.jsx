import { useWeb3 } from '../contexts/Web3Context';
import { FaHome, FaExchangeAlt, FaSyncAlt, FaGift, FaCog, FaRocket, FaFire, FaCoins, FaChartLine, FaShieldAlt, FaTrophy, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NavigationPage() {
  const { t } = useTranslation();
  const { userAddress } = useWeb3();

  const navigationItems = [
    {
      path: '/',
      icon: FaHome,
      title: '主页',
      subtitle: '项目概览和统计数据',
      description: '查看代币总供应量、持有者数量、交易量等关键指标，了解项目整体状况。',
      features: ['实时数据展示', '项目状态监控', '快速入口导航'],
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      path: '/presale',
      icon: FaExchangeAlt,
      title: '预售',
      subtitle: '参与代币预售活动',
      description: '白名单用户可以参与预售，每个地址都有独立的购买配额，确保公平分配。',
      features: ['白名单验证', '配额管理', '实时价格'],
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      path: '/swap',
      icon: FaSyncAlt,
      title: '兑换',
      subtitle: 'BNB 与 TAX 代币兑换',
      description: '通过 PancakeSwap 进行 BNB 和 TAX 代币的自由兑换，享受低滑点和深度流动性。',
      features: ['即时兑换', '最优价格', '实时图表'],
      color: 'orange',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      path: '/rewards',
      icon: FaGift,
      title: '奖励',
      subtitle: 'LP 持有者奖励领取',
      description: '流动性提供者可以按持有比例领取交易税收产生的 BNB 奖励，创造被动收入。',
      features: ['按比例分配', 'BNB 奖励', '随时领取'],
      color: 'green',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      path: '/admin',
      icon: FaCog,
      title: '管理',
      subtitle: '合约管理面板',
      description: '合约所有者可以管理交易状态、调整税率、添加白名单等高级功能。',
      features: ['税率设置', '状态管理', '白名单管理'],
      color: 'gray',
      gradient: 'from-gray-500 to-slate-600'
    }
  ];

  const getHoverClass = (color) => {
    const colors = {
      cyan: 'hover:from-cyan-600 hover:to-blue-700',
      purple: 'hover:from-purple-600 hover:to-pink-700',
      orange: 'hover:from-orange-600 hover:to-red-700',
      green: 'hover:from-green-600 hover:to-emerald-700',
      gray: 'hover:from-gray-600 hover:to-slate-700'
    };
    return colors[color] || colors.cyan;
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
            <FaRocket className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-6">
            导航中心
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
            探索 TaxToken DApp 的所有功能，快速访问您需要的页面
          </p>
        </div>
      </motion.div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.path}
            className="glass-card p-8 group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="text-white text-3xl" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className={`text-${item.color}-400 text-sm font-semibold mb-4`}>{item.subtitle}</p>
              <p className="text-gray-400 text-base leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Features */}
              <ul className="text-gray-400 text-sm space-y-2 mb-6">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FaCheckCircle className={`text-${item.color}-400 text-xs`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Link Button */}
              <Link
                to={item.path}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${item.gradient} ${getHoverClass(item.color)} transition-all duration-300 flex items-center justify-center gap-2 group`}
              >
                <span>进入页面</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        className="glass-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">快速统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FaCoins className="text-white text-xl" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">1M</p>
            <p className="text-gray-400 text-sm">总供应量</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">2.8K+</p>
            <p className="text-gray-400 text-sm">持有者</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <FaFire className="text-white text-xl" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">$5.2M</p>
            <p className="text-gray-400 text-sm">交易量</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FaTrophy className="text-white text-xl" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">125.3</p>
            <p className="text-gray-400 text-sm">BNB 奖励</p>
          </div>
        </div>
      </motion.div>

      {/* User Status */}
      {userAddress && (
        <motion.div
          className="glass-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShieldAlt className="text-cyan-400 text-2xl" />
            <h3 className="text-xl font-bold text-white">已连接钱包</h3>
          </div>
          <p className="text-gray-400 text-sm">
            您已成功连接到 TaxToken DApp，可以开始使用所有功能
          </p>
        </motion.div>
      )}
    </div>
  );
}
