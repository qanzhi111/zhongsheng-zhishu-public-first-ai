-- 代码审查技能
-- OpenClaw Skill: code-review

local skill = {
  name = "code-review",
  description = "自动进行代码审查",
  trigger = {
    "pr",
    "pull_request",
    "review"
  },
  actions = {
    {
      type = "analyze",
      file_patterns = {
        "*.ts",
        "*.tsx",
        "*.js",
        "*.jsx",
        "*.py"
      }
    },
    {
      type = "comment",
      template = [[
## 代码审查

### 文件分析
{{#each files}}
- {{this.filename}}: {{this.status}}
{{/each}}

### 建议
{{#if hasTests}}
✅ 包含测试
{{else}}
⚠️ 建议添加测试
{{/if}}

{{#if hasDocs}}
✅ 包含文档
{{else}}
⚠️ 建议更新文档
{{/if}}

---
*🔍 众生智枢AI审查*
]]
    },
    {
      type = "label",
      add = {"needs-review"}
    }
  }
}

return skill
