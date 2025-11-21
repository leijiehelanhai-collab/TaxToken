import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../contexts/Web3Context';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FaChartLine, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { ethers } from 'ethers';

// 从 localStorage 获取历史价格数据
const getStoredPriceHistory = () => {
  try {
    const stored = localStorage.getItem('taxTokenPriceHistory');
    if (stored) {
      const data = JSON.parse(stored);
      // 只保留最近90天的数据
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      return data.filter(item => item.timestamp > ninetyDaysAgo);
    }
  } catch (error) {
    console.error('读取价格历史失败:', error);
  }
  return [];
};

// 保存价格历史到 localStorage
const savePriceHistory = (history) => {
  try {
    localStorage.setItem('taxTokenPriceHistory', JSON.stringify(history));
  } catch (error) {
    console.error('保存价格历史失败:', error);
  }
};

export default function PriceChart() {
  const { t } = useTranslation();
  const { tradingEnabled, provider, contract, chainId } = useWeb3();

  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('area');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState(getStoredPriceHistory());
  const [loading, setLoading] = useState(false);

  // 获取当前价格（1 TAX = ? BNB）
  const fetchCurrentPrice = useCallback(async () => {
    if (!provider || !contract || !tradingEnabled) return null;

    try {
      // PancakeSwap Router 地址
      const routerAddresses = {
        97: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1', // BSC Testnet
        56: '0x10ED43C718714eb63d5aA57B78B54704E256024E'  // BSC Mainnet
      };

      const routerAddress = routerAddresses[chainId];
      if (!routerAddress) return null;

      // PancakeSwap Router ABI (只需要我们用的函数)
      const routerABI = [
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
        'function WETH() external pure returns (address)'
      ];

      const router = new ethers.Contract(routerAddress, routerABI, provider);
      const wethAddress = await router.WETH();

      // 查询 1 TAX 能换多少 BNB
      const amountIn = ethers.parseEther('1');
      const contractAddress = await contract.getAddress();
      const path = [contractAddress, wethAddress];

      const amounts = await router.getAmountsOut(amountIn, path);
      const priceInBNB = parseFloat(ethers.formatEther(amounts[1]));

      return priceInBNB;
    } catch (error) {
      console.error('获取价格失败:', error);
      return null;
    }
  }, [provider, contract, chainId, tradingEnabled]);

  // 定期获取价格并记录
  useEffect(() => {
    if (!tradingEnabled) return;

    const updatePrice = async () => {
      setLoading(true);
      const price = await fetchCurrentPrice();

      if (price !== null) {
        setCurrentPrice(price);

        // 添加到历史记录
        const now = Date.now();
        const newEntry = {
          timestamp: now,
          price: price,
          priceUSD: price * 600, // 假设 BNB = $600
          date: new Date(now).toLocaleString()
        };

        setPriceHistory(prev => {
          // 避免在同一分钟内重复添加
          const lastEntry = prev[prev.length - 1];
          const oneMinute = 60 * 1000;

          if (lastEntry && (now - lastEntry.timestamp) < oneMinute) {
            return prev;
          }

          const updated = [...prev, newEntry];
          savePriceHistory(updated);
          return updated;
        });
      }
      setLoading(false);
    };

    // 立即获取一次
    updatePrice();

    // 每30秒更新一次价格
    const interval = setInterval(updatePrice, 30000);

    return () => clearInterval(interval);
  }, [tradingEnabled, fetchCurrentPrice]);

  // 根据时间范围过滤数据
  const filteredData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];

    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };

    const cutoff = Date.now() - timeRanges[timeRange];
    const filtered = priceHistory.filter(item => item.timestamp >= cutoff);

    // 格式化日期显示
    return filtered.map(item => ({
      ...item,
      displayDate: new Date(item.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: timeRange === '24h' ? '2-digit' : undefined,
        minute: timeRange === '24h' ? '2-digit' : undefined
      })
    }));
  }, [priceHistory, timeRange]);

  // 计算价格变化
  const priceChange = useMemo(() => {
    if (filteredData.length < 2) return { value: 0, percent: 0 };
    const first = filteredData[0].price;
    const last = filteredData[filteredData.length - 1].price;
    const change = last - first;
    const percent = (change / first) * 100;
    return { value: change, percent };
  }, [filteredData]);

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-2">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-white">
            {payload[0].value.toFixed(8)} BNB
          </p>
          <p className="text-xs text-cyan-400">
            ≈ ${payload[0].payload.priceUSD.toFixed(6)} USD
          </p>
        </div>
      );
    }
    return null;
  };

  // 如果交易未开启，显示提示
  if (!tradingEnabled) {
    return (
      <div className="glass-card p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-yellow-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gradient">
            {t('swap.trading_not_started')}
          </h3>
          <p className="text-gray-400 mb-4">
            {t('swap.trading_not_started_desc')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-lg border border-yellow-500/30">
            <FaClock className="text-yellow-400" />
            <span className="text-gray-300">{t('swap.waiting_for_trading')}</span>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有足够的历史数据
  if (filteredData.length === 0) {
    return (
      <div className="glass-card p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-blue-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gradient">
            {t('swap.collecting_price_data')}
          </h3>
          <p className="text-gray-400 mb-4">
            {t('swap.collecting_price_data_desc')}
          </p>
          {currentPrice && (
            <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-slate-700/30 rounded-lg border border-cyan-500/30">
              <span className="text-sm text-gray-400">{t('swap.current_price')}</span>
              <span className="text-2xl font-bold text-white">
                {currentPrice.toFixed(8)} BNB
              </span>
              <span className="text-sm text-cyan-400">
                ≈ ${(currentPrice * 600).toFixed(6)} USD
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const latestPrice = filteredData[filteredData.length - 1];

  return (
    <div className="glass-card p-4 sm:p-5 md:p-6">
      {/* 标题和控制 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient flex items-center gap-2 mb-2 flex-wrap">
            <FaChartLine className="text-base sm:text-lg lg:text-xl" />
            <span>{t('swap.price_chart')}</span>
            {loading && (
              <span className="text-xs text-cyan-400 animate-pulse">● {t('common.updating')}</span>
            )}
          </h3>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">
              {latestPrice.price.toFixed(8)} BNB
            </span>
            <span className={`text-xs sm:text-sm font-semibold ${priceChange.percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange.percent >= 0 ? '↑' : '↓'} {Math.abs(priceChange.percent).toFixed(2)}%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            ≈ ${latestPrice.priceUSD.toFixed(6)} USD
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* 图表类型切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation min-h-[36px] ${
                chartType === 'area'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
              }`}
            >
              {t('swap.area_chart')}
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation min-h-[36px] ${
                chartType === 'line'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
              }`}
            >
              {t('swap.line_chart')}
            </button>
          </div>

          {/* 时间范围切换 */}
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation min-h-[36px] ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 图表 */}
      <div className="w-full h-[250px] sm:h-[300px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="displayDate"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => value.toFixed(8)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#priceGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="displayDate"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => value.toFixed(8)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 图表说明 */}
      <div className="mt-4 sm:mt-6 flex items-start gap-2 p-2.5 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <FaClock className="text-green-400 mt-0.5 flex-shrink-0 text-sm sm:text-base" />
        <div className="text-xs sm:text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">{t('swap.real_time_data')}</p>
          <p className="text-gray-400">
            {t('swap.real_time_data_desc', {
              count: filteredData.length,
              range: timeRange
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
