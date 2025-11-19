import React from 'react';

function TestApp() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
          TaxToken DApp 测试页面
        </h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">应用状态</h2>
          <p className="text-green-400">✅ React 应用正常运行</p>
          <p className="text-green-400">✅ Tailwind CSS 样式正常</p>
          <p className="text-green-400">✅ 基础组件渲染正常</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">下一步</h2>
          <p className="text-gray-300 mb-2">如果您看到此页面，说明基础环境已经正常。</p>
          <p className="text-gray-300">现在可以逐步启用完整的 DApp 功能。</p>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
