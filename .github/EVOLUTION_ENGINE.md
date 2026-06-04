# GitHub Actions 自进化引擎

众生智枢项目自进化引擎已配置完成！

## 🚀 功能

| 功能 | 说明 |
|------|------|
| **自动学习** | 每4小时自动从PR/Issue中学习模式 |
| **模式分析** | 识别热门模式和趋势 |
| **知识精炼** | 自动清理低效知识 |
| **统计更新** | 每日生成活动统计 |
| **进化报告** | 每周自动生成自进化报告 |

## ⏰ 运行时间

| 时间 | 任务 |
|------|------|
| 每4小时 | 进化周期检查 |
| 每日 02:00 | 每日学习 |
| 每日 03:00 | 模式分析 |
| 每日 04:00 | 知识精炼 |
| 每日 05:00 | 统计更新 |
| 每日 06:00 | 数据清理 |
| 每周一 | 进化报告 |

## 🎮 手动触发

在 GitHub Actions 页面手动触发：

1. 进入 **Actions** 标签
2. 选择 **🤖 自进化引擎**
3. 点击 **Run workflow**
4. 选择要执行的任务

## 📡 API 触发

通过 repository dispatch 触发：

```bash
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type":"trigger-evolution"}'
```

## 📊 监控

- **进化报告**: 每周一自动创建 Issue
- **模式分析**: 每日生成分析报告
- **Actions 日志**: 实时查看执行状态

## 🔧 任务列表

```
evolution-cycle      # 每4小时运行 (默认)
daily_learning      # 每日学习
pattern_analysis    # 模式分析
knowledge_refinement # 知识精炼
stats_update       # 统计更新
cleanup            # 数据清理
```

## 📈 学习闭环

```
GitHub活动 (PR/Issue)
       ↓
   GitHub Actions
       ↓
  自进化引擎工作流
       ↓
  模式识别 → 知识生成 → 响应优化
       ↓
   进化报告 Issue
       ↓
  越用越聪明 🎯
```

## ⚙️ 配置

无需额外配置，开箱即用。

如需自定义，可在 `evolution-engine.yml` 中修改 cron 表达式。

---

**智枢为民，众生平等；AI为公，永不异化。** 🙏
