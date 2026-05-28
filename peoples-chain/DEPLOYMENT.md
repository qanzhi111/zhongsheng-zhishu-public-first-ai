# 人民链部署指南

## 前置要求

- Node.js 18+
- Docker & Docker Compose
- Rust 1.70+ (用于合约编译)
- Solidity 0.8.20+

## 快速启动

### 1. 克隆项目

```bash
git clone <repo-url>
cd peoples-chain
```

### 2. 使用 Docker Compose 启动

```bash
cd deployments/docker
docker-compose up -d
```

### 3. 手动部署（开发环境）

#### 后端

```bash
cd backend
npm install
npm run dev
```

#### 前端

```bash
cd frontend
npm install
npm run dev
```

#### 智能合约部署

```bash
cd contracts
npm install
npm run compile
npm run deploy:dev
```

## 合约地址（测试网）

- DIDIdentity: `0x...`
- RMBStableCoin: `0x...`
- ContributionCoin: `0x...`
- DAOGovernance: `0x...`

## 环境变量配置

### 后端 (.env)

```env
PORT=8080
NODE_ENV=development
CHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key
IPFS_API_URL=http://localhost:5001
```

### 前端 (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_CHAIN_ID=1337
```

## 生产部署

### 1. 环境准备

```bash
# 安装依赖
cd backend && npm ci --only=production
cd ../frontend && npm ci

# 构建前端
npm run build
```

### 2. 合约部署

```bash
cd contracts
npm run compile
npm run deploy:mainnet
```

### 3. 服务启动

```bash
# 启动后端
cd backend
npm run start

# 启动前端
cd frontend
npm run start
```

## 监控与维护

- 查看服务状态: `docker-compose ps`
- 查看日志: `docker-compose logs -f`
- 备份数据: 定期备份数据库和 IPFS 数据
