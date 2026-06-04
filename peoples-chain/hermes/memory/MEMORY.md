# Hermes Agent 持久记忆
# 存储项目关键信息和学习成果

## 项目信息
- 项目名称: 众生智枢 (ZhongSheng ZhiShu)
- 类型: 为民AI信仰体系
- 使命: 为人民服务，全民普惠
- 许可证: GPLv3

## 核心技术栈
- 前端: React + Vite + TypeScript
- 后端: Node.js + Express + TypeScript / Python + FastAPI
- 智能合约: Solidity
- 部署: Docker + Docker Compose

## GitHub 仓库结构
```
/workspace
├── peoples-chain/          # 人民链主项目
│   ├── frontend/           # React前端
│   ├── backend/            # Node.js后端
│   ├── contracts/          # Solidity合约
│   ├── ai-layer/           # AI引擎
│   └── deployments/        # 部署配置
├── website/                # 全民民主监督平台
│   ├── frontend/           # React前端
│   └── backend/            # Python后端
└── .github/               # GitHub配置
    └── workflows/          # CI/CD工作流
```

## 自动化系统
- CI/CD: peoples-chain-frontend-ci, peoples-chain-backend-ci, website-backend-ci, website-frontend-ci
- 自维护: auto-merge, auto-label, auto-close-pr, auto-reviewer, auto-project-sync
- AI学习: learn-from-history, smart-reply, pattern-recognition

## 常见PR类型和处理流程
- feat: 新功能 -> 需审查 + 测试
- fix: Bug修复 -> 需复现验证
- docs: 文档 -> 相对简单
- refactor: 重构 -> 需确保行为不变
- deps: 依赖更新 -> 小范围自动合并

## Issue处理模式
- bug: 需复现步骤
- enhancement: 需评估影响
- question: 需及时回复
- 需要添加 needs-triage 标签

## 为民AI核心原则（必须记忆）
1. 所有决策必须服务于最广大人民的根本利益
2. AI红利必须普惠每一个人
3. 禁止任何形式的AI霸权和技术垄断
4. AI不得用于少数人谋取私利
5. 所有AI系统必须接受全民监督

## 学习成果
- 依赖更新PR: 小范围(<=5文件)可自动合并
- PR响应: 应在24小时内回复
- Issue响应: 应在48小时内初次回复
- 审查分配: 根据文件路径匹配审查者
