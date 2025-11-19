# TaxToken DApp 快速部署指南

## 步骤 1: 安装依赖

```bash
cd tax-token-dapp
npm install
```

## 步骤 2: 配置合约地址

打开 `src/constants.js`，修改合约地址：

```javascript
export const CONTRACT_ADDRESS = "0x669F53e3FA59b46d12740A20746855dCab899674";
```

将地址替换为你部署的 TaxToken 合约地址。

## 步骤 3: 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

## 步骤 4: 连接钱包测试

1. 点击"连接钱包"
2. 选择 MetaMask
3. 切换到 BSC Testnet
4. 开始使用！

## 主要功能说明

### 1. 主页 (/)
- 查看代币信息
- 查看税率配置
- 查看交易和预售状态
- 快速操作入口

### 2. 预售 (/presale)
- 查看预售信息
- 购买预售代币（需要白名单）
- 查看个人配额和购买记录

### 3. LP奖励 (/rewards)
- 查看 LP 持有信息
- 领取 BNB 奖励
- 查看历史领取记录

### 4. 管理 (/admin)
- 开启交易
- 修改买入/卖出税率
- 添加预售白名单
- 管理合约参数

## 部署到生产环境

### 使用 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 使用 Netlify

```bash
# 构建
npm run build

# 上传 dist 目录到 Netlify
```

### 使用自定义服务器

```bash
# 构建
npm run build

# 将 dist 目录部署到服务器
# 配置 nginx 或其他 Web 服务器
```

## Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 常见问题

### Q: 如何获取测试 BNB？
A: 访问 https://testnet.binance.org/faucet-smart

### Q: 如何切换到主网？
A: 修改 `src/constants.js` 中的 `REQUIRED_CHAIN_ID` 为 56

### Q: 如何自定义主题颜色？
A: 修改 `tailwind.config.js` 中的颜色配置

### Q: 如何添加更多语言？
A: 可以参考 my-mining-dapp 的多语言实现方式

## 项目地址

- 合约代码: `../TaxToken.sol`
- 部署脚本: `../deploy.js`
- 交互脚本: `../interact.js`

## 技术支持

如有问题请提交 Issue 或查看 README.md 文档。
