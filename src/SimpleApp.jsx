import { Routes, Route } from 'react-router-dom';
import ParticlesBackground from './components/ParticlesBackground';

// 简化的页面组件
const SimplePage = ({ title, description }) => (
  <div className="max-w-4xl mx-auto">
    <div className="glass-card p-8 text-center">
      <h2 className="text-3xl font-bold text-gradient mb-4">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

function SimpleApp() {
  return (
    <div className="min-h-screen text-white p-4 md:p-8 relative">
      {/* 背景 */}
      <ParticlesBackground />
      
      {/* 简单的头部 */}
      <header className="relative z-20 mb-8">
        <div className="glass-card p-6 text-center">
          <h1 className="text-3xl font-bold text-gradient">TaxToken DApp</h1>
          <p className="text-gray-400 mt-2">去中心化税收代币管理平台</p>
        </div>
      </header>

      {/* 简单的导航 */}
      <nav className="relative z-20 mb-6">
        <div className="glass-card p-4">
          <div className="flex justify-center gap-4">
            <a href="/" className="px-4 py-2 bg-cyan-500 text-white rounded-lg">主页</a>
            <a href="/presale" className="px-4 py-2 bg-slate-700 text-white rounded-lg">预售</a>
            <a href="/rewards" className="px-4 py-2 bg-slate-700 text-white rounded-lg">奖励</a>
            <a href="/admin" className="px-4 py-2 bg-slate-700 text-white rounded-lg">管理</a>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={
            <SimplePage 
              title="欢迎使用 TaxToken DApp" 
              description="支持预售、税收机制、LP奖励分配的去中心化代币管理平台" 
            />
          } />
          <Route path="/presale" element={
            <SimplePage 
              title="代币预售" 
              description="参与 TaxToken 预售，获得早期投资机会" 
            />
          } />
          <Route path="/rewards" element={
            <SimplePage 
              title="LP 奖励" 
              description="持有 LP 代币，获得交易税收奖励" 
            />
          } />
          <Route path="/admin" element={
            <SimplePage 
              title="管理面板" 
              description="合约管理功能，仅限管理员使用" 
            />
          } />
        </Routes>
      </main>
    </div>
  );
}

export default SimpleApp;
