# 众生智枢开源项目修复版
# ZhongSheng ZhiShu - Fixed Version

## 项目概述
众生智枢是一个基于 React + FastAPI 的全民民主监督平台，旨在确保AI系统始终服务于人民利益。

## 主要修复内容

### P0 严重问题修复
1. **API地址硬编码修复** - 所有前端 API 调用改为通过环境变量 `REACT_APP_API_URL` 配置
2. **添加错误处理** - 所有页面添加 error state 和 Alert 提示
3. **数据库升级** - 支持 PostgreSQL（生产环境），SQLite 降级为开发备用，启用 WAL 模式

### P1 中等问题修复
4. **SQLAlchemy API 更新** - 使用 SQLAlchemy 2.0 的 `DeclarativeBase`
5. **datetime API 更新** - 使用 `datetime.now(timezone.utc)` 替代废弃的 `datetime.utcnow()`
6. **CORS 安全配置** - 从环境变量 `CORS_ORIGINS` 读取
7. **添加路由** - 使用 react-router-dom 实现 URL 路由，刷新不再回到首页
8. **投票Bug修复** - VotingSystem 现在显示所有决策的投票统计，而非只看第一条
9. **添加频率限制** - 后端添加 IP 维度的 POST 请求限流（30次/分钟）
10. **防重复投票** - 后端投票接口添加唯一性检查

### P2 代码质量改进
11. **添加数据库索引** - 为常用查询字段添加索引
12. **Ant Design 组件更新** - Collapse 组件使用 items 属性替代废弃的 Panel

## 目录结构

```
zhongsheng-dev/
├── website/
│   ├── backend/                 # FastAPI 后端
│   │   ├── main.py              # 主应用文件（已重写）
│   │   ├── models.py             # 数据模型（已重写）
│   │   ├── schemas.py           # Pydantic 模式
│   │   ├── core.py              # 核心业务逻辑
│   │   └── requirements.txt     # Python 依赖
│   └── frontend/                 # React 前端
│       ├── public/
│       │   ├── index.html
│       │   └── manifest.json
│       └── src/
│           ├── App.js            # 主应用（已重写，添加路由）
│           ├── api/
│           │   └── client.js     # 统一API客户端（新增）
│           ├── hooks/
│           │   └── useApi.js     # 数据获取Hook（新增）
│           └── pages/             # 页面组件（已重写）
│               ├── Dashboard.js
│               ├── Decisions.js
│               ├── VotingSystem.js
│               ├── ViolationReports.js
│               └── EmergencyAlerts.js
├── .env.example                 # 环境变量示例
├── vercel.json                  # Vercel 部署配置
├── render.yaml                  # Render 部署配置
├── robots.txt                   # 爬虫规则
└── sitemap.xml                  # 站点地图
```

## 本地开发

### 前置要求
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ (可选，用于生产环境)

### 1. 克隆并安装后端

```bash
cd zhongsheng-dev/website/backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 复制并配置环境变量
cp ../../.env.example .env
# 编辑 .env 设置数据库等配置

# 运行后端
uvicorn main:app --reload --port 8000
```

后端运行在 http://localhost:8000

### 2. 安装并运行前端

```bash
cd zhongsheng-dev/website/frontend

# 安装依赖
npm install

# 复制并配置环境变量
cp ../../.env.example .env
# 编辑 .env 设置 REACT_APP_API_URL

# 运行前端
npm start
```

前端运行在 http://localhost:3000

## 部署指南

### 方案一：Vercel + 独立后端服务

#### 1. 部署后端到 Render/Railway/Fly.io

```bash
# 以 Render 为例
# 1. 在 Render 创建一个新的 Web Service
# 2. 连接 GitHub 仓库
# 3. 设置:
#    - Root Directory: website/backend
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
# 4. 添加环境变量:
#    - DATABASE_URL: your_postgres_connection_string
#    - CORS_ORIGINS: https://your-vercel-frontend.vercel.app
```

#### 2. 部署前端到 Vercel

```bash
# 1. 在 Vercel 创建一个新项目
# 2. 导入 GitHub 仓库
# 3. 设置:
#    - Framework Preset: Create React App
#    - Root Directory: website/frontend
# 4. 添加环境变量:
#    - REACT_APP_API_URL: https://your-backend.onrender.com
# 5. 部署
```

### 方案二：Docker 部署

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./website/backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/zhongsheng
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      - db

  frontend:
    build: ./website/frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  db:
    image: postgres:14
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=zhongsheng
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

运行:

```bash
docker-compose up -d
```

### 方案三：直接部署到 VPS

#### 1. 安装 Nginx 和配置

```nginx
# /etc/nginx/sites-available/zhongsheng

server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/zhongsheng/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

#### 2. 使用 systemd 管理后端

创建 `/etc/systemd/system/zhongsheng.service`:

```ini
[Unit]
Description=众生智枢后端服务
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/zhongsheng/website/backend
ExecStart=/var/www/zhongsheng/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

启用服务:

```bash
sudo systemctl enable zhongsheng
sudo systemctl start zhongsheng
sudo systemctl status zhongsheng
```

## 环境变量说明

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `DATABASE_URL` | 数据库连接URL | SQLite (开发模式) |
| `CORS_ORIGINS` | 允许的跨域来源 | `*` |
| `REACT_APP_API_URL` | 前端调用的后端API地址 | `http://localhost:8000` |
| `REACT_APP_SITE_URL` | 前端网站地址 | `http://localhost:3000` |
| `LOG_LEVEL` | 日志级别 | `INFO` |
| `DEBUG` | 调试模式 | `false` |

## API 端点

### 健康检查
- `GET /health` - 服务健康状态

### AI决策
- `GET /api/decisions` - 获取决策列表
- `GET /api/decisions/{id}` - 获取决策详情
- `POST /api/decisions` - 创建新决策

### 民主投票
- `GET /api/votes/overview` - 获取所有决策的投票概览
- `GET /api/votes/statistics/{id}` - 获取特定决策的投票统计
- `POST /api/votes` - 创建投票

### 违规报告
- `GET /api/violations` - 获取违规报告列表
- `POST /api/violations` - 提交违规报告

### 紧急警报
- `GET /api/emergency-alerts` - 获取紧急警报列表
- `POST /api/emergency-alerts/{id}/resolve` - 解决警报

### 仪表板
- `GET /api/dashboard-stats` - 获取仪表板统计数据

## 故障排除

### 前端无法连接后端
1. 检查 `REACT_APP_API_URL` 环境变量是否正确设置
2. 确认后端 CORS 配置包含前端域名
3. 检查浏览器控制台的网络请求错误

### 数据库连接失败
1. 确认 `DATABASE_URL` 格式正确
2. 检查数据库服务是否运行
3. 验证数据库用户权限

### 投票不显示统计
这是修复后的功能，现在会从 `/api/votes/overview` 获取所有决策的投票统计。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

智枢为民，众生平等；AI为公，永不异化。
