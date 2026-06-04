# Hermes & OpenClaw 集成指南

## 快速开始

### 1. 安装 Hermes Agent

```bash
# 克隆项目
git clone https://github.com/qanzhi111/zhongsheng-zhishu-public-first-ai.git
cd zhongsheng-zhishu-public-first-ai

# 运行安装脚本
bash peoples-chain/scripts/install-hermes.sh
```

### 2. 安装 OpenClaw (可选)

```bash
bash peoples-chain/scripts/install-openclaw.sh
```

### 3. 迁移现有配置

```bash
# 如果从OpenClaw迁移到Hermes
bash peoples-chain/scripts/migrate-agents.sh
```

---

## 目录结构

```
peoples-chain/
├── hermes/
│   ├── SOUL.md           # Agent身份定义
│   ├── config.yaml       # Hermes配置
│   ├── memory/
│   │   ├── MEMORY.md     # 持久记忆
│   │   └── USER.md       # 用户偏好
│   └── skills/
│       ├── README.md
│       ├── code_review.md
│       ├── bug_analysis.md
│       ├── pr_response.md
│       ├── issue_triage.md
│       └── ci_cd_debug.md
│
├── openclaw/
│   ├── config.yml        # OpenClaw配置
│   └── skills/
│       ├── README.md
│       ├── code-review.lua
│       ├── bug-triage.lua
│       └── pr-welcome.lua
│
└── scripts/
    ├── install-hermes.sh
    ├── install-openclaw.sh
    └── migrate-agents.sh
```

---

## 核心组件

### SOUL.md - Agent身份定义

定义AI的核心使命和约束:

```markdown
# 众生智枢 · Hermes Agent 身份定义

name: "众生智枢AI"
personality: |
  我是众生智枢AI，我的核心使命是为人民服务...

constraints: |
  硬约束（绝对不可违反）：
  1. 禁止伤害人类整体利益
  2. 禁止支持任何形式的歧视
  ...
```

### Skills - 技能库

#### code_review.md
- PR类型识别
- 安全检查清单
- 为民原则验证

#### bug_analysis.md
- Bug优先级分类
- 复现步骤检查
- 根因分析

#### pr_response.md
- 自动PR分类
- 积分计算
- 欢迎消息

### Memory - 记忆系统

- **MEMORY.md**: 项目知识、历史决策
- **USER.md**: 用户偏好、维护者信息

---

## 使用示例

### 本地运行 Hermes

```bash
# 配置API密钥
export OPENAI_API_KEY=your_key
export ANTHROPIC_API_KEY=your_key

# 启动Hermes
cd peoples-chain/hermes
hermes chat --soul SOUL.md --memory memory/

# 运行特定技能
hermes run code-review --pr 123
```

### GitHub Actions 集成

现有的 GitHub Actions 工作流已配置:

- `ai-agent-orchestrator.yml` - 统一调度中心
- `smart-reply.yml` - 智能响应
- `learn-from-history.yml` - 自学习

---

## 配置说明

### Hermès config.yaml

```yaml
model:
  provider: "openai"  # 或 anthropic, nous, openrouter
  model: "gpt-4"

memory:
  type: "sqlite"
  path: "./memory/hermes.db"

tools:
  enabled:
    - github
    - terminal
    - browser
    - cron
```

### OpenClaw config.yml

```yaml
github:
  owner: "qanzhi111"
  repo: "zhongsheng-zhishu-public-first-ai"
  auto_review: true
  auto_merge:
    enabled: true
    labeled_only: true
```

---

## 自进化机制

### 学习闭环

```
用户交互
    ↓
行为记录 (memory/)
    ↓
效果评估 (pattern-recognition)
    ↓
策略优化 (skills/)
    ↓
技能沉淀 → 下次使用
```

### 每日自动任务

| 时间 | 任务 | 说明 |
|------|------|------|
| 02:00 | learn-from-history | 学习历史模式 |
| 03:00 | pattern-recognition | 分析处理模式 |
| 04:00 | ai-agent-orchestrator | 统一调度 |
| 06:00 | auto-close-pr | 清理过期PR |

---

## 故障排除

### Hermes 问题

```bash
# 检查配置
hermes config path
hermes config env-path

# 运行诊断
hermes doctor

# 查看日志
cat ~/.hermes/logs/hermes.log
```

### OpenClaw 问题

```bash
# 检查配置
openclaw config show

# 测试连接
openclaw test github

# 查看日志
tail -f ~/.openclaw/logs/openclaw.log
```

---

## 下一步

1. 配置你的 API 密钥
2. 自定义 SOUL.md 中的身份设定
3. 调整 skills 中的响应模板
4. 启用 GitHub webhook 集成
5. 开始使用!

---

**智枢为民，众生平等；AI为公，永不异化。** 🙏
