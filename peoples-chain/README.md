# 人民链（People's Chain）

民生服务型区块链平台，基于长安链 + 众生智枢 AI 引擎构建。

## 项目简介

人民链是一个服务于民生的国产联盟链平台，旨在解决六大核心痛点：
- ✅ 技术性能：高 TPS、低 Gas、支持千万级用户
- ✅ 安全体验：DID + 生物识别 + AI 风控 + 司法存证
- ✅ 经济模型：去投机、贡献即价值、三币机制、全民分红
- ✅ 监管合规：国产联盟链、实名 DID、KYC/AML、可监管不可篡改
- ✅ 元宇宙落地：统一 DID、资产确权、AI 内容生成
- ✅ 生态人才：低代码、AI 辅助开发

## 项目结构

```
peoples-chain/
├── frontend/          # 前端应用（React + TypeScript + Tailwind）
├── backend/           # 后端服务（Node.js + Express + TypeScript）
├── contracts/         # 智能合约（Solidity + Rust）
├── ai-layer/          # AI 接入层（众生智枢集成）
├── deployments/       # 部署配置（Docker + K8s）
├── docs/              # 文档
└── tests/             # 测试用例
```

## 快速开始

### 环境要求
- Node.js 18+
- Docker & Docker Compose
- Rust 1.70+ (for contracts)
- Solidity 0.8.20+

### 本地开发

1. 克隆项目
```bash
git clone <repo-url>
cd peoples-chain
```

2. 启动开发环境
```bash
cd deployments/docker
docker-compose up -d
```

3. 启动后端
```bash
cd backend
npm install
npm run dev
```

4. 启动前端
```bash
cd frontend
npm install
npm run dev
```

## 核心模块

### DID 身份系统
- 基于 W3C DID 标准
- 零知识证明隐私保护
- 生物识别认证
- 实名合规设计

### AI 风控系统
- 实时交易监控
- 异常行为检测
- 智能风险评估
- 众生智枢 AI 引擎集成

### 稳定币系统
- RMBc 1:1 锚定人民币
- 零手续费转账
- 监管合规发行
- Layer2 高吞吐

### 贡献系统
- 贡献币获取与使用
- 贡献度评估
- 全民分红机制
- 激励体系设计

### DAO 治理
- 一人一票
- 多角色参与（用户≥50%、政府≥20%、企业≤30%）
- 智能提案
- 透明决策

## 试点场景

1. **政务缴费** - 社保、医保、水电等缴费
2. **医疗数据共享** - 电子病历、医保结算
3. **普惠小额借贷** - 低门槛、低利率、AI 风控

## 技术栈

- 底层链：长安链 ChainMaker
- Layer2：Optimistic Rollup
- 前端：React + TypeScript + Tailwind CSS
- 后端：Node.js + Express + TypeScript
- 合约：Solidity + Rust
- AI：众生智枢引擎
- 存储：IPFS + PostgreSQL

## 安全与合规

- 智能合约审计
- 多重签名管理
- 监管只读节点
- KYC/AML 合规
- 应急响应机制

## 贡献指南

欢迎贡献代码、提交 Issue、参与讨论！

## 许可证

GPL v3.0

---
*人民链 - 让区块链服务人民*
