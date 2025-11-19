export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 z-0">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      {/* 动态光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}
