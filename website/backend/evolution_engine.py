#!/usr/bin/env python3
"""
众生智枢 · 自进化引擎核心
ZhongSheng ZhiShu - Self-Evolution Engine

核心功能：
- 从历史数据中学习模式
- 生成和优化响应模板
- 技能自动沉淀
- 决策记忆持久化
"""

import sqlite3
import json
import os
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
import hashlib


class SelfEvolutionEngine:
    """
    自进化引擎核心类

    学习闭环：
    1. 收集数据 (Collect) - 从GitHub等来源收集数据
    2. 识别模式 (Pattern) - 识别常见模式和趋势
    3. 生成知识 (Knowledge) - 生成可复用的知识和模板
    4. 应用实践 (Apply) - 将知识应用到新场景
    5. 评估反馈 (Feedback) - 评估效果并持续优化
    """

    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "evolution.db")
        self.db_path = db_path
        self._init_database()

    def _init_database(self):
        """初始化进化数据库"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # 进化经验库
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS evolution_experience (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                experience_type TEXT,           -- 'pr_pattern', 'issue_pattern', 'response_template'
                trigger_pattern TEXT,            -- 触发关键词
                content TEXT,                    -- 经验内容(JSON)
                success_count INTEGER DEFAULT 0,
                failure_count INTEGER DEFAULT 0,
                last_used TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                effectiveness_score REAL DEFAULT 0.5,
                metadata TEXT
            )
        """)

        # 学习历史
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                learning_type TEXT,              -- 'pattern', 'template', 'skill'
                subject TEXT,                     -- 学习主题
                before_state TEXT,               -- 学习前状态
                after_state TEXT,                -- 学习后状态
                confidence REAL,                  -- 置信度
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 技能库
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skill_library (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                skill_name TEXT UNIQUE,
                skill_type TEXT,                 -- 'code_review', 'bug_analysis', 'issue_triage'
                description TEXT,
                usage_procedures TEXT,            -- JSON格式的使用流程
                success_criteria TEXT,
                success_count INTEGER DEFAULT 0,
                avg_execution_time REAL,
                last_refined TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 响应模板进化
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS template_evolution (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_type TEXT,              -- 'pr_welcome', 'bug_response', 'feature_request'
                template_content TEXT,
                version INTEGER DEFAULT 1,
                parent_id INTEGER,
                success_metrics TEXT,             -- JSON: 使用次数, 满意度等
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                refined_at TIMESTAMP
            )
        """)

        # 决策历史
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS decision_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                context TEXT,
                decision_type TEXT,
                action_taken TEXT,
                outcome TEXT,
                feedback_score REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 统计数据
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stat_date DATE UNIQUE,
                pr_processed INTEGER DEFAULT 0,
                pr_merged INTEGER DEFAULT 0,
                issue_processed INTEGER DEFAULT 0,
                issue_closed INTEGER DEFAULT 0,
                avg_response_time REAL,
                auto_response_count INTEGER DEFAULT 0,
                evolution_cycles INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 创建索引
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_exp_type ON evolution_experience(experience_type)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_skill_name ON skill_library(skill_name)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_template_type ON template_evolution(template_type)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_stat_date ON statistics(stat_date)")

        conn.commit()
        conn.close()

    # ============================================================
    # 核心学习算法
    # ============================================================

    def learn_from_pr(self, pr_data: Dict) -> Dict:
        """
        从PR数据中学习

        学习内容：
        1. PR类型识别模式
        2. 审查时间预测
        3. 自动合并可行性
        """
        title = pr_data.get("title", "").lower()
        labels = pr_data.get("labels", [])
        files_changed = pr_data.get("changed_files", 0)
        author = pr_data.get("author", "unknown")

        learned = {
            "patterns": [],
            "skills_updated": [],
            "new_knowledge": []
        }

        # 1. 学习PR类型识别模式
        pr_type = self._identify_pr_type(title)
        if pr_type:
            self._update_pattern(f"pr_type:{pr_type}", {
                "title_keywords": self._extract_keywords(title),
                "author": author,
                "labels": labels
            })
            learned["patterns"].append(f"pr_type:{pr_type}")

        # 2. 学习文件数量与复杂度
        complexity = self._assess_complexity(files_changed)
        self._update_pattern(f"complexity:{complexity}", {
            "files": files_changed,
            "author": author
        })

        # 3. 学习自动合并条件
        if self._can_auto_merge(pr_data):
            self._update_pattern("auto_merge_candidates", {
                "author": author,
                "type": pr_type,
                "files": files_changed
            })
            learned["new_knowledge"].append("auto_merge_eligible")

        # 4. 更新技能使用
        self._update_skill_usage(f"{pr_type}_review")

        return learned

    def learn_from_issue(self, issue_data: Dict) -> Dict:
        """
        从Issue数据中学习
        """
        title = issue_data.get("title", "").lower()
        body = issue_data.get("body", "").lower()
        labels = issue_data.get("labels", [])
        author = issue_data.get("author", "unknown")

        learned = {
            "patterns": [],
            "templates_suggested": [],
            "new_knowledge": []
        }

        # 1. 学习Issue类型
        issue_type = self._identify_issue_type(title, body, labels)
        if issue_type:
            self._update_pattern(f"issue_type:{issue_type}", {
                "title_keywords": self._extract_keywords(title),
                "body_keywords": self._extract_keywords(body[:500]),
                "author": author
            })
            learned["patterns"].append(f"issue_type:{issue_type}")

        # 2. 学习响应策略
        response_strategy = self._learn_response_strategy(issue_type, labels)
        if response_strategy:
            learned["templates_suggested"].append(response_strategy)

        # 3. 更新技能使用
        self._update_skill_usage(f"{issue_type}_triage")

        return learned

    def learn_from_feedback(self, context: str, action: str, outcome: str, feedback: float):
        """
        从反馈中学习（强化学习）

        feedback: -1.0 到 1.0 (负面到正面)
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO decision_history (context, action_taken, outcome, feedback_score)
            VALUES (?, ?, ?, ?)
        """, (context, action, outcome, feedback))

        # 更新相关经验的有效性分数
        cursor.execute("""
            UPDATE evolution_experience
            SET effectiveness_score = effectiveness_score * 0.9 + ? * 0.1,
                last_used = CURRENT_TIMESTAMP
            WHERE trigger_pattern = ?
        """, (feedback, context))

        conn.commit()
        conn.close()

        return {"feedback_recorded": True, "new_score": feedback}

    # ============================================================
    # 模式识别
    # ============================================================

    def recognize_pattern(self, text: str, context_type: str = "general") -> List[Dict]:
        """
        识别文本中的已知模式
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        text_lower = text.lower()
        keywords = self._extract_keywords(text_lower)

        patterns = []

        # 查找匹配的模式
        for keyword in keywords[:5]:  # 限制关键词数量
            cursor.execute("""
                SELECT id, trigger_pattern, content, effectiveness_score
                FROM evolution_experience
                WHERE trigger_pattern LIKE ? AND effectiveness_score > 0.3
                ORDER BY effectiveness_score DESC
                LIMIT 3
            """, (f"%{keyword}%",))

            for row in cursor.fetchall():
                patterns.append({
                    "id": row[0],
                    "pattern": row[1],
                    "content": json.loads(row[2]) if row[2] else {},
                    "confidence": row[3]
                })

        conn.close()
        return patterns

    def get_trending_topics(self, days: int = 7) -> List[Dict]:
        """
        获取近期热门话题/模式
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

        cursor.execute("""
            SELECT trigger_pattern, COUNT(*) as count,
                   AVG(effectiveness_score) as avg_score
            FROM evolution_experience
            WHERE created_at >= ?
            GROUP BY trigger_pattern
            ORDER BY count DESC
            LIMIT 10
        """, (since,))

        trends = []
        for row in cursor.fetchall():
            trends.append({
                "pattern": row[0],
                "occurrences": row[1],
                "avg_effectiveness": round(row[2], 2) if row[2] else 0
            })

        conn.close()
        return trends

    # ============================================================
    # 知识生成
    # ============================================================

    def generate_response_template(self, event_type: str, context: Dict) -> Optional[str]:
        """
        基于学习生成响应模板
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # 查找最相似的历史模板
        cursor.execute("""
            SELECT template_content, success_metrics
            FROM template_evolution
            WHERE template_type = ? AND is_active = 1
            ORDER BY (json_extract(success_metrics, '$.usage_count') * json_extract(success_metrics, '$.avg_satisfaction')) DESC
            LIMIT 1
        """, (event_type,))

        row = cursor.fetchone()

        # 如果没有找到，生成新模板
        if not row:
            template = self._generate_new_template(event_type, context)
        else:
            template = row[0]

        # 记录使用
        if row:
            metrics = json.loads(row[1]) if row[1] else {}
            metrics["usage_count"] = metrics.get("usage_count", 0) + 1
            cursor.execute("""
                UPDATE template_evolution
                SET success_metrics = ?
                WHERE template_type = ?
            """, (json.dumps(metrics), event_type))

        conn.commit()
        conn.close()

        return template

    def _generate_new_template(self, event_type: str, context: Dict) -> str:
        """生成新的响应模板"""
        templates = {
            "pr_welcome": """🎉🎉🎉 @{author} 感谢您的贡献！

欢迎加入**众生智枢**开发者社区！

## 📋 PR审查流程
1. 🤖 自动化检查（CI/CD）
2. 👀 代码审查
3. ✅ 合并到主分支

## 💡 快速链接
- 📖 [开发者文档](./DEVELOPER_RECRUITMENT.md)
- 🎯 [新手任务](./issues?q=label%3A%22good+first+issue%22)

---
**智枢为民，众生平等；AI为公，永不异化。** 🌟""",

            "bug_report": """🐛 **感谢 @${author} 报告Bug!**

我们已经收到您的Bug报告。

## 请协助确认
- [ ] 复现步骤
- [ ] 预期行为
- [ ] 实际行为
- [ ] 环境信息

## 处理流程
1. 确认Bug ✓
2. 定位问题
3. 修复
4. 验证

---
*🤖 众生智枢AI*""",

            "feature_request": """✨ **感谢 @${author} 提出功能建议!**

## 功能建议
> ${title}

## 请补充
- 🎯 要解决的问题
- 💡 建议的解决方案

---
*🤖 众生智枢AI*"""
        }

        return templates.get(event_type, "感谢您的贡献！")

    def refine_knowledge(self) -> Dict:
        """
        知识精炼 - 定期调用以优化知识库

        1. 清理低效经验
        2. 合并相似模式
        3. 更新有效性分数
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        refined = {
            "low_efficiency_removed": 0,
            "patterns_merged": 0,
            "templates_updated": 0
        }

        # 1. 清理低效经验
        cursor.execute("""
            DELETE FROM evolution_experience
            WHERE effectiveness_score < 0.2
            AND success_count + failure_count > 5
        """)
        refined["low_efficiency_removed"] = cursor.rowcount

        # 2. 更新统计数据
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute("""
            INSERT INTO statistics (stat_date, evolution_cycles)
            VALUES (?, 1)
            ON CONFLICT(stat_date) DO UPDATE SET
            evolution_cycles = evolution_cycles + 1
        """, (today,))

        conn.commit()
        conn.close()

        return refined

    # ============================================================
    # 辅助方法
    # ============================================================

    def _identify_pr_type(self, title: str) -> Optional[str]:
        """识别PR类型"""
        title = title.lower()
        if any(k in title for k in ["feat", "add", "new"]):
            return "feature"
        elif any(k in title for k in ["fix", "bug"]):
            return "bugfix"
        elif any(k in title for k in ["docs", "doc"]):
            return "documentation"
        elif any(k in title for k in ["refactor"]):
            return "refactor"
        elif any(k in title for k in ["deps", "depend", "update"]):
            return "dependency"
        elif any(k in title for k in ["perf", "performance"]):
            return "performance"
        elif any(k in title for k in ["security"]):
            return "security"
        return None

    def _identify_issue_type(self, title: str, body: str, labels: List) -> Optional[str]:
        """识别Issue类型"""
        if any(l.get("name") == "bug" for l in labels if isinstance(l, dict)):
            return "bug"
        elif any(l.get("name") == "enhancement" for l in labels if isinstance(l, dict)):
            return "enhancement"
        elif any(l.get("name") == "question" for l in labels if isinstance(l, dict)):
            return "question"
        elif "bug" in title or "error" in title or "crash" in title:
            return "bug"
        elif "feature" in title or "请求" in title or "建议" in title:
            return "enhancement"
        elif "如何" in title or "怎么" in title or "?" in title:
            return "question"
        return "general"

    def _extract_keywords(self, text: str) -> List[str]:
        """提取关键词"""
        # 简单分词
        words = re.findall(r'\b\w{3,}\b', text.lower())
        # 过滤停用词
        stopwords = {"the", "and", "for", "are", "but", "not", "you", "all", "can", "has", "have", "was", "were", "this", "that", "with", "from"}
        return [w for w in words if w not in stopwords][:10]

    def _assess_complexity(self, files_changed: int) -> str:
        """评估复杂度"""
        if files_changed <= 3:
            return "simple"
        elif files_changed <= 10:
            return "moderate"
        elif files_changed <= 30:
            return "complex"
        return "large"

    def _can_auto_merge(self, pr_data: Dict) -> bool:
        """判断是否可以自动合并"""
        title = pr_data.get("title", "").lower()
        files = pr_data.get("changed_files", 0)
        labels = pr_data.get("labels", [])

        # 依赖更新 + 小文件 = 可自动合并
        if "deps" in title or "depend" in title:
            return files <= 10

        # 文档更新 = 可自动合并
        if "docs" in title and files <= 5:
            return True

        return False

    def _learn_response_strategy(self, issue_type: str, labels: List) -> Optional[str]:
        """学习响应策略"""
        strategies = {
            "bug": "bug_report",
            "enhancement": "feature_request",
            "question": "question_response"
        }
        return strategies.get(issue_type)

    def _update_pattern(self, pattern_type: str, content: Dict):
        """更新模式"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        content_json = json.dumps(content)

        cursor.execute("""
            INSERT INTO evolution_experience (experience_type, trigger_pattern, content, last_used)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        """, (pattern_type.split(":")[0], pattern_type, content_json))

        conn.commit()
        conn.close()

    def _update_skill_usage(self, skill_name: str):
        """更新技能使用"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE skill_library
            SET success_count = success_count + 1,
                last_refined = CURRENT_TIMESTAMP
            WHERE skill_name = ?
        """, (skill_name,))

        conn.commit()
        conn.close()


# 全局单例
_evolution_engine = None


def get_evolution_engine() -> SelfEvolutionEngine:
    """获取进化引擎单例"""
    global _evolution_engine
    if _evolution_engine is None:
        _evolution_engine = SelfEvolutionEngine()
    return _evolution_engine
