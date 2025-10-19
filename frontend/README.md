# 加密问卷调查 dApp - 前端

这是加密问卷调查 dApp 的前端应用，基于 React + Vite + Ethers.js 构建。

## 功能特性

✅ **连接钱包** - MetaMask 集成
✅ **创建问卷** - 支持多种问题类型
✅ **浏览问卷** - 查看所有可用问卷
✅ **参与问卷** - 提交加密回答
✅ **查看结果** - 可视化统计数据

## 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Ethers.js 6** - 以太坊交互
- **React Router** - 路由管理

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置合约地址

编辑 `src/utils/contract.js`，更新合约地址：

```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 4. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist/` 目录

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── components/      # React 组件
│   │   ├── CreateSurvey.jsx      # 创建问卷
│   │   ├── SurveyList.jsx        # 问卷列表
│   │   ├── TakeSurvey.jsx        # 参与问卷
│   │   └── SurveyResults.jsx     # 结果展示
│   ├── hooks/           # 自定义 Hooks
│   │   └── useWeb3.js            # Web3 连接
│   ├── utils/           # 工具函数
│   │   ├── contract.js           # 合约配置
│   │   └── helpers.js            # 辅助函数
│   ├── App.jsx          # 主应用
│   ├── main.jsx         # 入口文件
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json         # 依赖配置
```

## 使用说明

### 1. 连接钱包

- 点击"连接钱包"按钮
- 在 MetaMask 中确认连接
- 确保连接到正确的网络（Sepolia 测试网）

### 2. 创建问卷

1. 点击"创建问卷"标签
2. 填写问卷标题和描述
3. 设置持续时间（天）
4. 添加问题：
   - 是/否题
   - 1-5 分评分
   - 1-10 分评分
   - 多选题（需设置选项数）
5. 点击"创建问卷"并在 MetaMask 中确认交易

### 3. 参与问卷

1. 在问卷列表中选择一个问卷
2. 点击"参与问卷"
3. 回答所有问题
4. 点击"提交问卷"并确认交易
5. 每个问卷只能回答一次

### 4. 查看结果

1. 在问卷列表中点击"查看结果"
2. 查看聚合统计数据：
   - 总回答数
   - 每个问题的总和、平均值
   - 可视化进度条

## 环境要求

- Node.js >= 16
- npm 或 yarn
- MetaMask 浏览器扩展
- Sepolia 测试网 ETH

## 网络配置

### Sepolia 测试网

- Network Name: Sepolia
- RPC URL: https://rpc.ankr.com/eth_sepolia
- Chain ID: 11155111
- Symbol: SepoliaETH
- Block Explorer: https://sepolia.etherscan.io

## 常见问题

### 1. MetaMask 无法连接

- 确保已安装 MetaMask
- 刷新页面
- 检查网络连接

### 2. 交易失败

- 确保账户有足够的 SepoliaETH
- 检查 Gas 费用设置
- 确认连接到正确的网络

### 3. 合约地址错误

- 确认已在 `contract.js` 中设置正确的合约地址
- 检查合约是否已部署到当前网络

### 4. 获取测试 ETH

访问以下水龙头获取 Sepolia ETH：
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

## 开发提示

### 热更新

Vite 支持热模块替换（HMR），修改代码后会自动刷新页面。

### 调试

打开浏览器开发者工具查看：
- Console: 查看日志和错误
- Network: 检查 RPC 请求
- MetaMask: 查看交易详情

### 合约 ABI 更新

如果合约有更新，需要：
1. 重新部署合约
2. 更新 `src/utils/contract.js` 中的 `CONTRACT_ADDRESS`
3. 如有接口变化，更新 `CONTRACT_ABI`

## 性能优化

- ✅ 使用 React.memo 避免不必要的重渲染
- ✅ 懒加载组件
- ✅ 缓存合约实例
- ✅ 批量读取数据

## 安全注意事项

⚠️ **重要**：
- 不要在前端代码中存储私钥
- 所有敏感操作都需要用户在 MetaMask 中确认
- 验证所有用户输入
- 使用 HTTPS 部署生产环境

## 部署

### Vercel 部署

```bash
npm run build
vercel --prod
```

### Netlify 部署

```bash
npm run build
netlify deploy --prod --dir=dist
```

### IPFS 部署

```bash
npm run build
ipfs add -r dist/
```

## License

MIT
