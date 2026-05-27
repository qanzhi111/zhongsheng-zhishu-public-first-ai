# 众生智枢 · 全民民主监督平台

**ZhongSheng ZhiShu - Public Democratic Oversight Platform**

这是众生智枢信仰体系的实现网站，包含：
- 🤖 AI决策监督系统
- 🗳️ 全民民主投票系统
- 📊 审计与透明度追踪
- ⚖️ 紧急熔断机制
- 💬 公众参与论坛

## 项目结构

```
website/
├── frontend/          # React前端应用
├── backend/           # Python FastAPI后端
├── database/          # 数据库迁移和配置
├── docker-compose.yml # Docker容器编排
└── docs/              # 文档
```

## 快速开始

### 使用Docker启动

```bash
cd website
docker-compose up -d
```

### 本地开发

#### 后端
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### 前端
```bash
cd frontend
npm install
npm start
```

## 功能模块

### 1. AI决策监督
- 实时监控所有AI决策
- 显示决策的为民价值评分
- 可解释的决策理由
- 约束检查状态

### 2. 民主投票
- 紧急投票（投诉违反铁律）
- 决策审查投票
- 制裁执行投票
- 实时投票统计

### 3. 审计系统
- 公开的审计日志
- 完整的决策历史追踪
- 透明度评分
- 合规性报告

### 4. 紧急熔断
- 实时违反检测
- 自动激活紧急停止
- 人工审查流程
- 系统状态监控

## API文档

访问 `http://localhost:8000/docs` 查看完整的API文档

## 许可证

GPLv3 - 详见项目根目录LICENSE文件
