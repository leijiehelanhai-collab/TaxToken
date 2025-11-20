# 🌟 TaxToken DApp

一个功能完整的去中心化税务代币管理平台，支持预售、代币兑换、LP 奖励分配等功能。

## ✨ 主要功能

- 🏠 **首页** - 展示项目概览和统计数据
- 💰 **预售** - 支持白名单预售，配额管理
- 🔄 **Swap** - BNB 和 TAX 代币自由兑换（集成 PancakeSwap）
- 🎁 **奖励** - LP 持有者可领取 BNB 奖励
- ⚙️ **管理** - 合约所有者管理面板

## 🌍 多语言支持

支持 6 种语言：
- 🇺🇸 English
- 🇨🇳 中文
- 🇰🇷 한국어
- 🇯🇵 日本語
- 🇪🇸 Español
- 🇩🇪 Deutsch

## 🛠️ 技术栈

- **前端框架**: React 19 + Vite
- **样式**: Tailwind CSS
- **Web3**: ethers.js v6
- **路由**: React Router DOM v7
- **国际化**: i18next
- **图标**: React Icons
- **动画**: Particles.js

## 📦 安装

```bash
npm install
```

### 2. 配置合约地址

编辑 `src/constants.js`，设置你的合约地址：

```javascript
export const CONTRACT_ADDRESS = "0x你的合约地址";
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
tax-token-dapp/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.jsx      # 页头和钱包连接
│   │   ├── DesktopNav.jsx  # 桌面端导航
│   │   ├── MobileBottomNav.jsx  # 移动端底部导航
│   │   ├── ParticlesBackground.jsx  # 粒子背景
│   │   ├── HomePage.jsx    # 主页
│   │   ├── PresalePage.jsx # 预售页
│   │   ├── RewardsPage.jsx # 奖励页
│   │   └── AdminPage.jsx   # 管理页
│   ├── contexts/
│   │   └── Web3Context.jsx # Web3 状态管理
│   ├── abi/
│   │   └── TaxToken.json   # 合约 ABI
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 应用入口
│   ├── index.css           # 全局样式
│   └── constants.js        # 配置常量
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
└── tailwind.config.js      # Tailwind 配置
```

## 使用说明

### 连接钱包

1. 点击右上角"连接钱包"按钮
2. 选择 MetaMask 或其他 Web3 钱包
3. 确认连接并切换到 BSC Testnet

### 参与预售

1. 前往"预售"页面
2. 确认你在预售白名单中
3. 输入要花费的 BNB 数量
4. 点击"购买代币"并确认交易

### 领取 LP 奖励

1. 在 PancakeSwap 添加 TAX/BNB 流动性
2. 前往"LP奖励"页面
3. 查看可领取的 BNB 数量
4. 点击"领取奖励"

### 管理功能（仅管理员）

1. 前往"管理"页面
2. 可以进行以下操作：
   - 开启交易
   - 修改买入/卖出税率
   - 添加预售白名单

## 环境要求

- Node.js >= 16
- MetaMask 或其他 Web3 钱包
- BSC Testnet BNB（用于测试）

## 获取测试 BNB

访问 [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart) 领取测试 BNB。

## 🚀 部署

查看 [部署指南](./DEPLOYMENT_GUIDE.md) 了解详细的部署步骤。

### 快速部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/tax-token-dapp)

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

## 📝 配置

在 `src/constants.js` 中配置你的合约信息：

```javascript
export const CONTRACT_ADDRESS = "0x你的合约地址";
export const REQUIRED_CHAIN_ID = 97; // BSC Testnet
```

## 常见问题

### 1. 无法连接钱包？
- 确保已安装 MetaMask
- 检查浏览器是否支持 Web3
- 尝试刷新页面

### 2. 交易失败？
- 确认网络是 BSC Testnet
- 检查 BNB 余额是否充足（Gas费）
- 查看 MetaMask 错误信息

### 3. 显示"网络错误"？
- 点击"切换到 BSC Testnet"按钮
- 手动在 MetaMask 中切换网络

## 开发

### 添加新页面

1. 在 `src/components` 创建新组件
2. 在 `App.jsx` 添加路由
3. 在导航组件中添加链接

### 修改样式

- 全局样式: `src/index.css`
- Tailwind 配置: `tailwind.config.js`
- 组件内联样式: 使用 Tailwind 类名

### 添加合约功能

1. 在 `src/abi/TaxToken.json` 添加 ABI
2. 在 `src/contexts/Web3Context.jsx` 添加方法
3. 在组件中调用方法

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub: [https://github.com/leijiehelanhai-collab](https://github.com/leijiehelanhai-collab)
- Twitter: [@hai_lan84606](https://x.com/hai_lan84606?s=21)
- weixin: 19823413454

---

⭐ 如果这个项目对你有帮助，请给个 Star！

Made with ❤️ by [你的名字]

