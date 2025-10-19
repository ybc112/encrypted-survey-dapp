# 🔐 Encrypted Survey dApp

一个基于区块链的隐私保护问卷调查平台，使用 React + Ethers.js + Solidity 构建。

## 功能特性

- 🔒 **隐私保护**: 使用加密技术保护用户响应
- 🌐 **去中心化**: 基于以太坊智能合约
- 📊 **实时统计**: 自动聚合调查结果
- 🎨 **现代界面**: 响应式设计，用户体验友好

## 技术栈

- **前端**: React 18, Vite, Ethers.js v6
- **智能合约**: Solidity, Hardhat
- **网络**: Sepolia 测试网
- **部署**: Vercel

## 本地开发

### 前置要求

- Node.js 16+
- MetaMask 钱包
- Sepolia 测试网 ETH

### 安装依赖

```bash
# 安装项目依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

2. 配置环境变量：
```bash
# .env
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key

# frontend/.env
VITE_CONTRACT_ADDRESS=deployed_contract_address
```

### 运行项目

```bash
# 启动前端开发服务器
cd frontend
npm run dev
```

访问 http://localhost:4002

## 智能合约

合约已部署到 Sepolia 测试网：
- 地址: `0x20F2dbbF57d4B421dF8CEfBaC3C55e2cB5Cc2096`
- 网络: Sepolia Testnet

### 合约功能

- `createSurvey()`: 创建新调查
- `addQuestion()`: 添加问题
- `submitResponse()`: 提交响应
- `getQuestionResult()`: 获取结果统计

## 部署

### GitHub 部署

1. 创建 GitHub 仓库
2. 推送代码到仓库
3. 连接到 Vercel

### Vercel 部署

1. 在 Vercel 中导入 GitHub 仓库
2. 配置环境变量：
   - `VITE_CONTRACT_ADDRESS`: 智能合约地址
3. 部署完成

## 使用说明

1. **连接钱包**: 点击"Connect Wallet"连接 MetaMask
2. **切换网络**: 确保连接到 Sepolia 测试网
3. **创建调查**: 填写调查信息和问题
4. **参与调查**: 选择调查并提交响应
5. **查看结果**: 调查结束后查看统计结果

## 项目结构

```
├── contracts/              # 智能合约
├── frontend/               # React 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── hooks/          # 自定义 Hooks
│   │   └── utils/          # 工具函数
├── scripts/                # 部署脚本
└── test/                   # 测试文件
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
