#!/usr/bin/env python3
"""
众生智枢 · 响应生成器
基于学习生成智能响应
"""

import json
from typing import Dict, List, Optional
from datetime import datetime


class ResponseGenerator:
    """
    智能响应生成器

    根据上下文和历史学习生成合适的响应
    """

    def __init__(self):
        self.templates = self._load_templates()

    def _load_templates(self) -> Dict:
        """加载响应模板"""
        return {
            "pr_welcome": {
                "template": """🎉🎉🎉 @{author} 感谢您的贡献！

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
**智枢为民，众生平等；AI为公，永不异化。** 🌟""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.8}
            },

            "pr_feature": {
                "template": """✨ **感谢 @{{author}} 提交新功能!**

## 功能概述
- 📝 标题: {title}
- 📂 文件变更: {files} 个
- ➕ 新增: {additions} 行 | ➖ 删除: {deletions} 行

## 审查重点
- ✅ 功能完整性
- ✅ 代码质量
- ✅ 测试覆盖
- ✅ 文档更新

## 下一步
1. CI检查通过后会自动分配审查者
2. 预计审查时间: 1-2个工作日

---
*🎯 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.8}
            },

            "pr_bugfix": {
                "template": """🐛 **感谢 @{{author}} 修复Bug!**

## Bug修复信息
- 📝 标题: {title}
- 📂 文件变更: {files} 个

## 审查重点
- ✅ 问题复现确认
- ✅ 修复验证
- ✅ 是否引入新问题
- ⚠️ 测试用例是否覆盖

## 紧急程度
{priority}

---
*🎯 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.9}
            },

            "pr_docs": {
                "template": """📖 **感谢完善文档!**

## 文档变更
- 📝 标题: {title}
- 📂 文件变更: {files} 个

## 审查重点
- ✅ 内容准确性
- ✅ 格式一致性
- ✅ 链接有效性

---
*🎯 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.7}
            },

            "pr_deps": {
                "template": """📦 **依赖更新PR**

## 更新内容
- 📝 标题: {title}
- 📂 文件变更: {files} 个

## 自动处理
{auto_merge_status}

---
*🎯 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.6}
            },

            "pr_merged": {
                "template": """🎉 **PR已合并!**

感谢 @{author} 的贡献！

## 贡献信息
- 🏅 贡献积分: +{points}
- 🎖️ 贡献类型: {badge}

## 下一步
- 您的代码将部署到生产环境
- 查看 [CONTRIBUTORS.md](./CONTRIBUTORS.md) 了解积分排名

---
**智枢为民，众生平等。** 🙏""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 1.0}
            },

            "issue_bug": {
                "template": """🐛 **感谢 @{author} 报告Bug!**

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
*🤖 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.8}
            },

            "issue_enhancement": {
                "template": """✨ **感谢 @{author} 提出功能建议!**

## 功能建议
> {title}

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
*🤖 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.7}
            },

            "issue_question": {
                "template": """❓ **感谢 @{author} 的提问!**

我们会尽快回复您的问题。

## 请提供
- 🔍 您尝试了什么？
- ❌ 遇到了什么错误？
- 💻 您的环境是什么？

## 快速链接
- 📖 [FAQ文档](./docs/faq.md)
- 💬 [社区讨论](./discussions)

---
*🤖 众生智枢AI自动回复*""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.6}
            },

            "stale_reminder": {
                "template": """⏰ 您好！

此{type}已超过 **{days}天** 无更新。

如需保持活跃，请：
- ✅ 回复审查意见
- ✅ 更新最新代码
- ✅ 说明当前状态

{action_notice}

---
**保持项目整洁是我们的共同责任。** 💪""",
                "success_metrics": {"usage_count": 0, "avg_satisfaction": 0.5}
            }
        }

    def generate_pr_response(self, pr_data: Dict) -> str:
        """生成PR响应"""
        pr_type = self._identify_pr_type(pr_data.get("title", ""))
        author = pr_data.get("user", {}).get("login", "unknown") if isinstance(pr_data.get("user"), dict) else pr_data.get("author", "unknown")
        title = pr_data.get("title", "")
        files = pr_data.get("changed_files", 0)
        additions = pr_data.get("additions", 0)
        deletions = pr_data.get("deletions", 0)

        if pr_type == "feature":
            template = self.templates.get("pr_feature", {})
            content = template["template"].format(
                author=author,
                title=title,
                files=files,
                additions=additions,
                deletions=deletions
            )
        elif pr_type == "bugfix":
            template = self.templates.get("pr_bugfix", {})
            priority = "🔴 **紧急**" if "critical" in title.lower() or "urgent" in title.lower() else "🟡 **一般**"
            content = template["template"].format(
                author=author,
                title=title,
                files=files,
                priority=priority
            )
        elif pr_type == "docs":
            template = self.templates.get("pr_docs", {})
            content = template["template"].format(
                author=author,
                title=title,
                files=files
            )
        elif pr_type == "deps":
            template = self.templates.get("pr_deps", {})
            auto_status = "✅ 小幅更新，将自动合并" if files <= 10 else "⏳ 需要审查后合并"
            content = template["template"].format(
                author=author,
                title=title,
                files=files,
                auto_merge_status=auto_status
            )
        else:
            template = self.templates.get("pr_welcome", {})
            content = template["template"].format(author=author)

        # 更新使用统计
        self._update_template_usage(f"pr_{pr_type or 'general'}")

        return content

    def generate_issue_response(self, issue_data: Dict) -> str:
        """生成Issue响应"""
        issue_type = self._identify_issue_type(issue_data)
        author = issue_data.get("user", {}).get("login", "unknown") if isinstance(issue_data.get("user"), dict) else issue_data.get("author", "unknown")
        title = issue_data.get("title", "")

        if issue_type == "bug":
            template = self.templates.get("issue_bug", {})
        elif issue_type == "enhancement":
            template = self.templates.get("issue_enhancement", {})
        elif issue_type == "question":
            template = self.templates.get("issue_question", {})
        else:
            # 默认欢迎模板
            template = self.templates.get("pr_welcome", {})

        content = template["template"].format(author=author, title=title)

        # 更新使用统计
        self._update_template_usage(f"issue_{issue_type}")

        return content

    def generate_merged_response(self, pr_data: Dict, points: int, badge: str) -> str:
        """生成PR合并响应"""
        template = self.templates.get("pr_merged", {})
        author = pr_data.get("user", {}).get("login", "unknown") if isinstance(pr_data.get("user"), dict) else pr_data.get("author", "unknown")

        content = template["template"].format(
            author=author,
            points=points,
            badge=badge
        )

        self._update_template_usage("pr_merged")

        return content

    def generate_stale_reminder(self, item_type: str, days: int, action_notice: str = "") -> str:
        """生成过期提醒"""
        template = self.templates.get("stale_reminder", {})

        if not action_notice:
            action_notice = "7天后将自动关闭。"

        content = template["template"].format(
            type=item_type,
            days=days,
            action_notice=action_notice
        )

        self._update_template_usage("stale_reminder")

        return content

    def _identify_pr_type(self, title: str) -> Optional[str]:
        """识别PR类型"""
        title = title.lower()
        if any(k in title for k in ["feat", "add", "new"]):
            return "feature"
        elif any(k in title for k in ["fix", "bug"]):
            return "bugfix"
        elif any(k in title for k in ["docs", "doc"]):
            return "docs"
        elif any(k in title for k in ["deps", "depend", "update"]):
            return "deps"
        elif any(k in title for k in ["refactor"]):
            return "refactor"
        return None

    def _identify_issue_type(self, issue_data: Dict) -> str:
        """识别Issue类型"""
        labels = issue_data.get("labels", [])
        title = issue_data.get("title", "").lower()

        if any(l.get("name") == "bug" for l in labels if isinstance(l, dict)):
            return "bug"
        elif any(l.get("name") == "enhancement" for l in labels if isinstance(l, dict)):
            return "enhancement"
        elif any(l.get("name") == "question" for l in labels if isinstance(l, dict)):
            return "question"

        if "bug" in title or "error" in title:
            return "bug"
        elif "feature" in title or "请求" in title:
            return "enhancement"
        elif "如何" in title or "怎么" in title:
            return "question"

        return "general"

    def _update_template_usage(self, template_key: str):
        """更新模板使用统计"""
        # 这个方法会在实际使用时更新数据库
        pass

    def get_points_for_pr(self, title: str) -> tuple:
        """计算PR积分"""
        title = title.lower()
        if "feat" in title or "add" in title or "new" in title:
            return 30, "✨"
        elif "fix" in title or "bug" in title:
            return 10, "🐛"
        elif "docs" in title or "doc" in title:
            return 5, "📖"
        elif "test" in title:
            return 15, "🧪"
        elif "refactor" in title:
            return 20, "♻️"
        elif "security" in title:
            return 50, "🛡️"
        elif "perf" in title or "performance" in title:
            return 20, "⚡"
        return 5, "🎨"


# 全局单例
_response_generator = None


def get_response_generator() -> ResponseGenerator:
    """获取响应生成器单例"""
    global _response_generator
    if _response_generator is None:
        _response_generator = ResponseGenerator()
    return _response_generator
