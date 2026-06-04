-- Bug分类技能
-- OpenClaw Skill: bug-triage

local skill = {
  name = "bug-triage",
  description = "自动分类和处理Bug报告",
  trigger = {
    "issue",
    "bug",
    "error",
    "crash"
  },
  actions = {
    {
      type = "label",
      add = {"bug", "needs-triage"}
    },
    {
      type = "comment",
      template = [[
🐛 **Bug报告已收到**

感谢 @{{author}} 报告此Bug。

## 请提供
- [ ] 复现步骤
- [ ] 预期行为
- [ ] 实际行为
- [ ] 环境信息
- [ ] 错误日志

## 处理流程
1. 确认Bug ✓
2. 定位问题
3. 修复
4. 验证

---
*🤖 众生智枢AI*
]]
    },
    {
      type = "assign",
      team = "bug-squad"
    }
  }
}

return skill
