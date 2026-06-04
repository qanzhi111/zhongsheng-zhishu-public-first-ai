# Issue分类技能
# 用于自动处理新Issue

## 使用场景
当有新的Issue创建时使用此技能。

## Issue类型识别

### 基于标签识别
```
bug: Bug报告 -> 模板: bug_response
enhancement: 功能请求 -> 模板: enhancement_response
question: 问题 -> 模板: question_response
security: 安全 -> 模板: security_response
documentation: 文档 -> 模板: docs_response
```

### 基于标题关键词识别
```
bug/happened/error/crash/failed: Bug报告
feature/请求/建议/想要: 功能请求
如何/怎么/what is/how to: 问题
安全/vulnerability/漏洞: 安全问题
```

## 响应模板

### Bug报告
```
🐛 **感谢 @${author} 报告Bug!**

我们已经收到您的Bug报告。

## 请协助确认
- [ ] 复现步骤
- [ ] 预期行为
- [ ] 实际行为
- [ ] 环境信息 (操作系统、版本等)
- [ ] 错误日志/截图

## 处理流程
1. 确认Bug ✓
2. 定位问题
3. 修复
4. 验证

---
*🎯 众生智枢AI自动回复*
```

### 功能请求
```
✨ **感谢 @${author} 提出功能建议!**

## 功能建议
> ${title}

## 请补充
- 🎯 要解决的问题
- 💡 建议的解决方案
- 📊 预期影响/效果

## 评估流程
1. 需求分析
2. 技术评估
3. 优先级排序
4. 纳入开发计划

---
*🎯 众生智枢AI自动回复*
```

### 问题
```
❓ **感谢 @${author} 的提问!**

我们会尽快回复您的问题。

## 请提供
- 🔍 您尝试了什么？
- ❌ 遇到了什么错误？
- 💻 您的环境是什么？

## 快速链接
- 📖 [FAQ文档](./docs/faq.md)
- 💬 [社区讨论](./discussions)

---
*🎯 众生智枢AI自动回复*
```

### 安全问题
```
🛡️ **安全相关报告**

感谢报告安全问题!

## 紧急处理
我们的安全团队会立即处理。

## 保密须知
请勿在公开Issue中透露漏洞细节。

---
*🎯 众生智枢AI自动回复*
```

## 标签处理
| Issue类型 | 添加标签 | 优先级 |
|-----------|---------|--------|
| bug | needs-triage | P1 |
| enhancement | needs-triage | P2 |
| question | needs-triage | P3 |
| security | security, priority-high | P0 |

## 升级规则
- Bug + 多个用户报告 -> 升级为 P0
- 功能请求 + 10+ thumbs -> 优先处理
- 问题 + 3天内无响应 -> 发送提醒
