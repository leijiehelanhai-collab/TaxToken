import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { FaChartLine, FaClock } from 'react-icons/fa';

// 生成模拟的价格数据
const generatePriceData = (days) => {
  const data = [];
  const now = Date.now();
  let price = 0.00015; // 初始价格 (BNB)

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    const date = new Date(timestamp);

    // 模拟价格波动
    const change = (Math.random() - 0.45) * price * 0.15;
    price = Math.max(0.00001, price + change);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleString(),
      price: parseFloat(price.toFixed(8)),
      priceUSD: parseFloat((price * 600).toFixed(6)), // 假设 BNB = $600
      volume: Math.floor(Math.random() * 50000) + 10000
    });
  }

  return data;
};

export default function PriceChart() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('area');

  // 根据时间范围生成数据
  const priceData = useMemo(() => {
    const days = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    return generatePriceData(days[timeRange] || 7);
  }, [timeRange]);

  // 计算价格变化
  const priceChange = useMemo(() => {
    if (priceData.length < 2) return { value: 0, percent: 0 };
    const first = priceData[0].price;
    const last = priceData[priceData.length - 1].price;
    const change = last - first;
    const percent = (change / first) * 100;
    return { value: change, percent };
  }, [priceData]);

  const currentPrice = priceData[priceData.length - 1]?.price || 0;
  const currentPriceUSD = priceData[priceData.length - 1]?.priceUSD || 0;

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-2">{payload[0].payload.fullDate}</p>
          <p className="text-sm font-bold text-white">
            {payload[0].value.toFixed(8)} BNB
          </p>
          <p className="text-xs text-cyan-400">
            ≈ ${payload[0].payload.priceUSD.toFixed(6)} USD
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Vol: {payload[0].payload.volume.toLocaleString()} TAX
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      {/* 标题和控制 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-gradient flex items-center gap-2 mb-2">
            <FaChartLine />
            {t('swap.price_chart')}
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl lg:text-3xl font-bold text-white">
              {currentPrice.toFixed(8)} BNB
            </span>
            <span className={`text-sm font-semibold ${priceChange.percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange.percent >= 0 ? '↑' : '↓'} {Math.abs(priceChange.percent).toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            ≈ ${currentPriceUSD.toFixed(6)} USD
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* 图表类型切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
              }`}
            >
              {t('swap.area_chart')}
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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
      <div className="w-full h-[300px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={priceData}
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
                dataKey="date"
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
              data={priceData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="date"
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
      <div className="mt-6 flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <FaClock className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">{t('swap.chart_notice')}</p>
          <p className="text-gray-400">{t('swap.chart_notice_desc')}</p>
        </div>
      </div>
    </div>
  );
}
