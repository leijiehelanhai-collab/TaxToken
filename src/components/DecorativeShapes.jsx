import { motion } from 'framer-motion';

// 浮动的渐变球体
export const FloatingOrb = ({ className = '', color = 'cyan', size = 'md', delay = 0 }) => {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80'
  };

  const colors = {
    cyan: 'from-cyan-400/30 via-cyan-500/20 to-blue-500/30',
    purple: 'from-purple-400/30 via-purple-500/20 to-pink-500/30',
    green: 'from-green-400/30 via-emerald-500/20 to-teal-500/30',
    orange: 'from-orange-400/30 via-amber-500/20 to-yellow-500/30'
  };

  return (
    <motion.div
      className={`absolute ${sizes[size]} rounded-full bg-gradient-to-br ${colors[color]} blur-3xl ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// 几何图形装饰
export const GeometricShape = ({ type = 'circle', className = '' }) => {
  const shapes = {
    circle: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="url(#grad1)" strokeWidth="2" opacity="0.3" />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    ),
    hexagon: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 100 100" fill="none">
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="url(#grad2)" strokeWidth="2" opacity="0.3" />
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    ),
    triangle: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 100 100" fill="none">
        <path d="M50 10 L90 90 L10 90 Z" stroke="url(#grad3)" strokeWidth="2" opacity="0.3" />
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    )
  };

  return shapes[type] || shapes.circle;
};

// 动态网格背景
export const GridPattern = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

// 光束效果
export const LightBeam = ({ className = '' }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent transform -skew-x-12" />
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent transform skew-x-12" />
    </motion.div>
  );
};

// 粒子点效果
export const DotPattern = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-cyan-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
};

// 波浪线
export const WaveLine = ({ className = '' }) => {
  return (
    <svg className={`w-full ${className}`} viewBox="0 0 1200 120" preserveAspectRatio="none">
      <motion.path
        d="M0,50 Q300,100 600,50 T1200,50"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 3D立方体图标
export const CubeIcon = ({ className = '' }) => {
  return (
    <svg className={`${className}`} viewBox="0 0 100 100" fill="none">
      <motion.g
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <path d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z" fill="url(#cubeGrad)" opacity="0.9" />
        <path d="M50 10 L80 30 L50 50 L20 30 Z" fill="url(#cubeTop)" opacity="0.95" />
        <path d="M50 50 L80 70 L80 30 Z" fill="url(#cubeRight)" opacity="0.85" />
        <path d="M50 50 L20 70 L20 30 Z" fill="url(#cubeLeft)" opacity="0.8" />
      </motion.g>
      <defs>
        <linearGradient id="cubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 渐变卡片装饰
export const CardGlowEffect = ({ className = '' }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      animate={{
        background: [
          'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// 旋转的圆环
export const SpinningRing = ({ className = '', size = 200 }) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" stroke="url(#ringGrad1)" strokeWidth="2" opacity="0.4" strokeDasharray="10 5" />
        <circle cx="100" cy="100" r="60" stroke="url(#ringGrad2)" strokeWidth="2" opacity="0.3" strokeDasharray="5 10" />
        <defs>
          <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

// 币形图标动画
export const CoinAnimation = ({ className = '' }) => {
  return (
    <motion.div
      className={`${className}`}
      animate={{
        rotateY: [0, 360],
        y: [0, -10, 0],
      }}
      transition={{
        rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="35" fill="url(#coinGrad)" />
        <circle cx="40" cy="40" r="30" stroke="#fff" strokeWidth="2" opacity="0.3" />
        <text x="40" y="50" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">TAX</text>
        <defs>
          <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

// 数据可视化图形
export const DataVisualization = ({ className = '' }) => {
  return (
    <svg className={`${className}`} viewBox="0 0 300 200" fill="none">
      <motion.path
        d="M10 150 Q 50 100, 100 120 T 200 80 T 290 100"
        stroke="url(#chartGrad)"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.circle cx="100" cy="120" r="4" fill="#06b6d4" 
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.circle cx="200" cy="80" r="4" fill="#8b5cf6"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.5, delay: 1 }}
      />
      <motion.circle cx="290" cy="100" r="4" fill="#ec4899"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};
