# TaxToken DApp 完整使用指南

## 🎯 项目概述

TaxToken DApp 是一个完整的 Web3 去中心化应用，基于 TaxToken 智能合约构建。它提供了一个友好的用户界面来管理代币预售、查看LP奖励、以及进行合约管理操作。

## 📦 项目文件结构

```
tax-token-dapp/
├── src/
│   ├── components/              # 页面组件
│   │   ├── Header.jsx          # 顶部导航和钱包连接
│   │   ├── DesktopNav.jsx      # 桌面端主导航
│   │   ├── MobileBottomNav.jsx # 移动端底部导航
│   │   ├── ParticlesBackground.jsx # 动态粒子背景
│   │   ├── HomePage.jsx        # 主页 - 展示项目信息和统计
│   │   ├── PresalePage.jsx     # 预售页 - 购买预售代币
│   │   ├── RewardsPage.jsx     # 奖励页 - 领取LP奖励
│   │   └── AdminPage.jsx       # 管理页 - 合约管理功能
│   ├── contexts/
│   │   └── Web3Context.jsx     # Web3状态管理和合约交互
│   ├── abi/
│   │   └── TaxToken.json       # 合约ABI接口定义
│   ├── App.jsx                 # 主应用组件和路由配置
│   ├── main.jsx                # 应用入口
│   ├── index.css               # 全局样式和自定义类
│   └── constants.js            # 配置常量
├── public/                     # 静态资源
├── index.html                  # HTML模板
├── package.json                # 依赖配置
├── vite.config.js              # Vite构建配置
├── tailwind.config.js          # Tailwind CSS配置
├── postcss.config.js           # PostCSS配置
├── eslint.config.js            # ESLint配置
├── README.md                   # 项目说明
└── DEPLOY.md                   # 部署指南
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd tax-token-dapp
npm install
```

### 2. 配置合约地址

编辑 `src/constants.js`：

```javascript
export const CONTRACT_ADDRESS = "0x你的合约地址";
export const REQUIRED_CHAIN_ID = 97; // BSC Testnet
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 💻 页面功能详解

### 1. 主页 (/)

**功能：**
- 展示项目概览和核心信息
- 显示买入税和卖出税配置
- 显示用户代币余额
- 显示白名单状态
- 显示交易和预售状态
- 快速导航到其他功能页面

**关键元素：**
- 欢迎横幅
- 4个统计卡片（买入税、卖出税、余额、白名单）
- 3个功能介绍卡片
- 快速操作按钮

### 2. 预售页 (/presale)

**功能：**
- 查看预售基本信息（价格、最小购买量）
- 查看个人预售配额和已购买数量
- 输入BNB数量购买代币
- 实时计算将获得的代币数量

**使用流程：**
1. 连接钱包
2. 确认在预售白名单中
3. 输入要花费的BNB数量
4. 点击"购买代币"
5. 在MetaMask中确认交易

**注意事项：**
- 仅白名单地址可以购买
- 不能超过个人配额
- 预售结束后无法购买

### 3. LP奖励页 (/rewards)

**功能：**
- 查看LP持有信息
- 查看可领取的BNB奖励
- 领取累积的奖励
- 查看历史领取记录

**信息展示：**
- LP余额
- 持有占比
- 可领取奖励（BNB）
- 累计已领取（BNB）

**领取奖励流程：**
1. 确保持有LP代币
2. 查看可领取奖励金额
3. 点击"领取奖励"
4. 确认交易

**如何获得LP代币：**
1. 访问 PancakeSwap
2. 为 TAX/BNB 交易对添加流动性
3. 获得LP代币后即可领取奖励

### 4. 管理页 (/admin)

**权限：** 仅合约所有者可访问

**功能：**
- 查看合约状态
- 开启交易
- 修改买入税率
- 修改卖出税率
- 添加预售白名单

**税率管理：**
- 奖励税：进入奖励池
- 燃烧税：销毁代币
- 营销税：进入营销钱包
- 总税率限制：不超过25%

**预售白名单管理：**
- 输入钱包地址
- 设置配额（TAX代币数量）
- 点击添加

## 🎨 设计风格说明

### 颜色方案

- **主色调：** 青色 (Cyan) - #06b6d4
- **辅助色：** 蓝色 (Blue) - #3b82f6
- **背景色：** 深色 - #090D1A
- **卡片背景：** 半透明灰 - slate-800/50

### UI特性

- **玻璃拟态效果：** 毛玻璃背景 + 边框高光
- **动态背景：** 粒子连线动画
- **按钮光泽：** 悬停时的光泽扫过效果
- **响应式设计：** 桌面端和移动端适配
- **渐变文字：** 标题使用青蓝渐变

### 组件样式类

```css
.glass-card       /* 玻璃拟态卡片 */
.btn-primary      /* 主按钮 */
.btn-secondary    /* 次要按钮 */
.input-field      /* 输入框 */
.text-gradient    /* 渐变文字 */
.btn-shine        /* 按钮光泽效果 */
```

## 🔧 技术实现

### Web3 Context

所有合约交互都通过 `Web3Context` 管理：

```javascript
const {
  // 连接状态
  userAddress,
  chainId,
  isOwner,
  isSupportedNetwork,

  // 代币信息
  tokenBalance,
  bnbBalance,
  buyTax,
  sellTax,

  // 合约状态
  tradingEnabled,
  presaleActive,
  presaleInfo,
  lpInfo,

  // 操作方法
  connectWallet,
  disconnectWallet,
  buyPresale,
  claimRewards,
  enableTrading,
  updateBuyTax,
  updateSellTax,
  addPresaleWhitelist
} = useWeb3();
```

### 合约交互示例

#### 购买预售

```javascript
const handleBuy = async () => {
  await buyPresale("0.1"); // 花费 0.1 BNB
};
```

#### 领取奖励

```javascript
const handleClaim = async () => {
  await claimRewards();
};
```

#### 更新税率（管理员）

```javascript
const handleUpdateTax = async () => {
  await updateBuyTax(2, 1, 2); // 奖励2%, 燃烧1%, 营销2%
};
```

## 🌐 部署指南

### Vercel 部署

```bash
npm i -g vercel
vercel --prod
```

### Netlify 部署

```bash
npm run build
# 上传 dist 目录
```

### 自定义服务器

```bash
npm run build
# 部署 dist 目录到服务器
```

## ⚙️ 配置选项

### 网络配置 (constants.js)

```javascript
export const REQUIRED_CHAIN_ID = 97; // BSC Testnet
// 改为 56 切换到主网
```

### 更新间隔

```javascript
export const UPDATE_INTERVAL = 10000; // 10秒
```

### 主题颜色 (tailwind.config.js)

```javascript
theme: {
  extend: {
    colors: {
      primary: { ... }
    }
  }
}
```

## 🐛 常见问题

### 1. 钱包无法连接

**解决方法：**
- 确保安装了 MetaMask
- 刷新页面重试
- 检查浏览器控制台错误

### 2. 网络错误提示

**解决方法：**
- 点击"切换到 BSC Testnet"
- 在 MetaMask 中手动切换网络

### 3. 交易失败

**可能原因：**
- Gas 费不足
- 合约参数错误
- 权限不足

**解决方法：**
- 检查 BNB 余额
- 查看 MetaMask 错误信息
- 确认操作权限

### 4. 余额不更新

**解决方法：**
- 等待10秒（自动更新间隔）
- 刷新页面
- 检查网络连接

## 📱 移动端使用

### 移动端特性

- 底部固定导航栏
- 触摸优化的按钮
- 简化的卡片布局
- 响应式文字大小

### MetaMask 移动端

1. 下载 MetaMask 应用
2. 在应用内浏览器打开 DApp
3. 正常使用所有功能

## 🔒 安全建议

### 用户端

- 不要分享私钥
- 确认交易详情再签名
- 注意钓鱼网站
- 使用硬件钱包（推荐）

### 管理员端

- 使用多签钱包管理合约
- 在 Gas 低时操作
- 仔细核对参数
- 保管好管理员私钥

## 📊 性能优化

### 已实现的优化

- 组件懒加载
- 状态缓存
- 防抖处理
- 最小化重新渲染

### 建议优化

- 启用 PWA
- 图片压缩
- 代码分割
- CDN 加速

## 🎓 学习资源

### React
- https://react.dev/

### ethers.js
- https://docs.ethers.org/

### Tailwind CSS
- https://tailwindcss.com/

### Solidity
- https://docs.soliditylang.org/

## 📝 更新日志

### v1.0.0 (2024)
- ✅ 完整的 Web3 集成
- ✅ 预售功能
- ✅ LP 奖励领取
- ✅ 管理面板
- ✅ 响应式设计
- ✅ 粒子背景效果

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

---

**祝你使用愉快！** 🚀
