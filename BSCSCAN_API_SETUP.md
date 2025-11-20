# BSCScan API 配置指南

## 为什么需要BSCScan API？

为了获取代币的真实持有者数量，我们需要使用BSCScan API来查询区块链上的Transfer事件。这是因为智能合约本身无法直接统计持有者数量。

## 如何获取免费的BSCScan API Key

### 1. 注册BSCScan账户

访问 [https://bscscan.com/register](https://bscscan.com/register) 注册一个免费账户。

### 2. 生成API Key

1. 登录后，访问 [https://bscscan.com/myapikey](https://bscscan.com/myapikey)
2. 点击 "Add" 按钮创建新的API Key
3. 给API Key起一个名字（例如：TaxToken DApp）
4. 复制生成的API Key

### 3. 配置API Key

打开 `src/constants.js` 文件，找到 `BSCSCAN_API` 配置：

```javascript
export const BSCSCAN_API = {
  97: {
    url: 'https://api-testnet.bscscan.com/api',
    apiKey: 'YourApiKeyToken' // 替换为您的API key
  },
  56: {
    url: 'https://api.bscscan.com/api',
    apiKey: 'YourApiKeyToken' // 替换为您的API key
  }
};
```

将 `'YourApiKeyToken'` 替换为您刚才复制的API Key。

## 免费API限制

BSCScan免费API有以下限制：
- **每秒5次请求**
- **每天100,000次请求**

对于大多数DApp来说，这已经足够了。我们的应用每10秒才更新一次数据，远低于限制。

## 测试网和主网

- **测试网 (Testnet - Chain ID 97)**: 使用 `https://api-testnet.bscscan.com/api`
- **主网 (Mainnet - Chain ID 56)**: 使用 `https://api.bscscan.com/api`

两个网络可以使用同一个API Key。

## 无API Key的情况

如果不配置API Key，持有者数量将显示为 "..." 或 0。其他功能（总供应量、交易量、LP奖励）不受影响，因为它们直接从区块链读取。

## 数据更新频率

持有者数量每10秒更新一次（与其他统计数据同步）。由于需要扫描Transfer事件，首次加载可能需要几秒钟。

## CORS 问题解决方案

BSCScan API 不支持直接从浏览器调用（CORS限制）。我们通过 Vite 开发服务器的代理功能解决了这个问题：

**vite.config.js 配置：**
```javascript
proxy: {
  '/api/bscscan': {
    target: 'https://api-testnet.bscscan.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/bscscan/, '/api')
  }
}
```

这样，前端请求 `/api/bscscan?...` 会被代理到 `https://api-testnet.bscscan.com/api?...`

⚠️ **注意**：代理只在开发环境有效。生产环境需要配置服务器端代理或使用后端API。

## 故障排除

### 持有者数量显示为0或"..."

1. 检查API Key是否正确配置
2. 检查浏览器控制台是否有错误信息
3. 确认合约地址正确
4. 确认网络ID正确（测试网97或主网56）
5. **确保开发服务器已重启**（修改 vite.config.js 后需要重启）

### CORS 错误

如果看到类似错误：
```
Access to fetch at 'https://api-testnet.bscscan.com/api' has been blocked by CORS policy
```

**解决方案**：
1. 确认 `vite.config.js` 中已配置代理
2. 确认 `constants.js` 中使用的是代理路径（`/api/bscscan`）
3. 重启开发服务器：`npm run dev`

### API请求失败

1. 检查网络连接
2. 确认API Key有效且未过期
3. 检查是否超过API请求限制
4. 查看BSCScan API状态页面
5. 检查代理配置是否正确

## 安全提示

⚠️ **不要将API Key提交到公共代码仓库！**

建议使用环境变量来存储API Key：

1. 创建 `.env` 文件：
```
VITE_BSCSCAN_API_KEY=你的API_Key
```

2. 在 `constants.js` 中使用：
```javascript
apiKey: import.meta.env.VITE_BSCSCAN_API_KEY || 'YourApiKeyToken'
```

3. 确保 `.env` 在 `.gitignore` 中。
