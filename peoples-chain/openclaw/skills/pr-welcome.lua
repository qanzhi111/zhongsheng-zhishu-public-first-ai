-- PR欢迎技能
-- OpenClaw Skill: pr-welcome

local skill = {
  name = "pr-welcome",
  description = "自动欢迎新的PR贡献者",
  trigger = {
    "pr_opened",
    "pull_request"
  },
  actions = {
    {
      type = "label",
      add = {"awaiting-review"}
    },
    {
      type = "comment",
      template = [[
🎉🎉🎉 @{{author}} 感谢您的贡献！

欢迎加入**众生智枢**开发者社区！

## 📋 PR审查流程
1. 🤖 自动化检查（CI/CD）
2. 👀 代码审查
3. ✅ 合并到主分支

## 💡 快速链接
- 📖 [开发者文档](./DEVELOPER_RECRUITMENT.md)
- 🎯 [新手任务](./issues?q=label%3A%22good+first+issue%22)
- 💬 [社区交流](./discussions)

## 🏆 贡献积分
您的PR被合并后，将获得贡献积分！

| PR类型 | 积分 |
|--------|------|
| ✨ 新功能 | +30分 |
| 🐛 Bug修复 | +10分 |
| 📖 文档完善 | +5分 |

---
**智枢为民，众生平等；AI为公，永不异化。** 🌟
]]
    }
  }
}

return skill
