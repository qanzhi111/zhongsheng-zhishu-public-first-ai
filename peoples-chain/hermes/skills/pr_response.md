# PR响应技能
# 用于自动生成PR响应

## 使用场景
当有新的PR创建或PR状态变更时使用此技能。

## PR类型识别

### 基于标题关键词识别
```
feat/feature: 新功能 -> labels: enhancement
fix/bug: Bug修复 -> labels: bug
docs/doc: 文档 -> labels: documentation
refactor: 重构 -> labels: refactoring
perf/performance: 性能优化 -> labels: performance
test/testing: 测试 -> labels: testing
chore: 杂项 -> labels: chore
deps/dependency: 依赖更新 -> labels: dependencies
security: 安全 -> labels: security
```

## 响应模板

### 新功能PR
```
✨ **感谢 @${author} 提交新功能!**

## 功能概述
- 📝 标题: ${title}
- 📂 文件变更: ${files} 个
- ➕ 新增: ${additions} 行 | ➖ 删除: ${deletions} 行

## 审查重点
- ✅ 功能完整性
- ✅ 代码质量
- ✅ 测试覆盖
- ✅ 文档更新

## 下一步
1. CI检查通过后会自动分配审查者
2. 预计审查时间: 1-2个工作日

---
*🎯 众生智枢AI自动回复*
```

### Bug修复PR
```
🐛 **感谢 @${author} 修复Bug!**

## Bug修复信息
- 📝 标题: ${title}
- 📂 文件变更: ${files} 个

## 审查重点
- ✅ 问题复现确认
- ✅ 修复验证
- ✅ 是否引入新问题
- ⚠️ 测试用例是否覆盖

---
*🎯 众生智枢AI自动回复*
```

### 文档PR
```
📖 **感谢完善文档!**

## 文档变更
- 📝 标题: ${title}
- 📂 文件变更: ${files} 个

## 审查重点
- ✅ 内容准确性
- ✅ 格式一致性
- ✅ 链接有效性

---
*🎯 众生智枢AI自动回复*
```

### 依赖更新PR
```
📦 **依赖更新PR**

## 更新内容
- 📝 标题: ${title}
- 📂 文件变更: ${files} 个

## 自动处理
${files <= 5 ? '✅ 小幅更新，将自动合并' : '⏳ 需要审查后合并'}

---
*🎯 众生智枢AI自动回复*
```

### PR合并成功
```
🎉 **PR已合并!**

感谢 @${author} 的贡献!

## 贡献信息
- 🏅 贡献积分: +${points}
- 🎖️ 贡献类型: ${type}

## 下一步
- 您的代码将部署到生产环境
- 查看 [CONTRIBUTORS.md](./CONTRIBUTORS.md) 了解积分排名

---
*🎯 众生智枢AI自动回复*
```

## 标签映射
| PR类型 | 自动添加标签 |
|--------|-------------|
| feat | enhancement, needs-review |
| fix | bug, needs-review, priority-high |
| docs | documentation |
| refactor | refactoring |
| deps | dependencies |
| < 5文件 | automerge |
| > 20文件 | large-pr |
| draft | work-in-progress |

## 积分规则
- ✨ 新功能: +30分
- 🛡️ 安全修复: +50分
- ⚡ 性能优化: +20分
- ♻️ 代码重构: +20分
- 🧪 测试编写: +15分
- 🐛 Bug修复: +10分
- 📖 文档完善: +5分
- 🎨 其他: +5分
