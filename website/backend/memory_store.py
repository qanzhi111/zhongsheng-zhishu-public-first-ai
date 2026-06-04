"""
AI 记忆存储与学习模块
存储历史决策、PR模式、Issue处理经验，实现自我进化
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from collections import defaultdict


class AIMemoryStore:
    """AI记忆存储器 - 支持向量式记忆检索"""

    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "ai_memory.db")
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """初始化数据库表"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # PR处理历史
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pr_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pr_number INTEGER,
                title TEXT,
                body TEXT,
                author TEXT,
                labels TEXT,
                files_changed TEXT,
                review_time_hours REAL,
                merged BOOLEAN,
                auto_merged BOOLEAN,
                created_at TIMESTAMP,
                merged_at TIMESTAMP,
                raw_data TEXT
            )
        """)

        # Issue处理历史
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS issue_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                issue_number INTEGER,
                title TEXT,
                body TEXT,
                author TEXT,
                labels TEXT,
                response_time_hours REAL,
                closed BOOLEAN,
                closed_at TIMESTAMP,
                resolution_type TEXT,
                created_at TIMESTAMP,
                raw_data TEXT
            )
        """)

        # 决策记录
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                decision_type TEXT,
                context TEXT,
                action_taken TEXT,
                outcome TEXT,
                feedback_score REAL,
                created_at TIMESTAMP
            )
        """)

        # 技能/模式库
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skill_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pattern_type TEXT,
                trigger_keywords TEXT,
                pattern_data TEXT,
                success_count INTEGER DEFAULT 0,
                failure_count INTEGER DEFAULT 0,
                last_used TIMESTAMP,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )
        """)

        # 响应模板库
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS response_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_type TEXT,
                keywords TEXT,
                template_content TEXT,
                usage_count INTEGER DEFAULT 0,
                avg_feedback REAL,
                last_used TIMESTAMP,
                created_at TIMESTAMP
            )
        """)

        # 学习统计
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stat_date DATE,
                pr_processed INTEGER DEFAULT 0,
                issue_processed INTEGER DEFAULT 0,
                decisions_made INTEGER DEFAULT 0,
                auto_merged INTEGER DEFAULT 0,
                avg_response_time REAL,
                success_rate REAL,
                created_at TIMESTAMP
            )
        """)

        conn.commit()
        conn.close()

    def store_pr(self, pr_data: Dict):
        """存储PR数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO pr_history (
                pr_number, title, body, author, labels, files_changed,
                merged, created_at, raw_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            pr_data.get("number"),
            pr_data.get("title"),
            pr_data.get("body"),
            pr_data.get("user", {}).get("login"),
            json.dumps(pr_data.get("labels", [])),
            json.dumps(pr_data.get("changed_files", [])),
            pr_data.get("merged", False),
            pr_data.get("created_at"),
            json.dumps(pr_data)
        ))

        conn.commit()
        conn.close()

        # 更新技能模式
        self._update_skill_from_pr(pr_data)

    def store_issue(self, issue_data: Dict):
        """存储Issue数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO issue_history (
                issue_number, title, body, author, labels,
                created_at, raw_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            issue_data.get("number"),
            issue_data.get("title"),
            issue_data.get("body"),
            issue_data.get("user", {}).get("login"),
            json.dumps(issue_data.get("labels", [])),
            issue_data.get("created_at"),
            json.dumps(issue_data)
        ))

        conn.commit()
        conn.close()

        # 更新技能模式
        self._update_skill_from_issue(issue_data)

    def record_decision(self, decision_type: str, context: str, action: str, outcome: str = None):
        """记录AI决策"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO decisions (decision_type, context, action_taken, outcome, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (decision_type, context, action, outcome, datetime.utcnow().isoformat()))

        conn.commit()
        conn.close()

    def _update_skill_from_pr(self, pr_data: Dict):
        """从PR数据中提取并更新技能模式"""
        title = pr_data.get("title", "").lower()

        # 根据PR标题识别类型
        skill_type = "general"
        if any(k in title for k in ["feat", "add", "new"]):
            skill_type = "feature"
        elif any(k in title for k in ["fix", "bug"]):
            skill_type = "bugfix"
        elif any(k in title for k in ["docs", "doc"]):
            skill_type = "documentation"
        elif any(k in title for k in ["refactor"]):
            skill_type = "refactor"
        elif any(k in title for k in ["deps", "update"]):
            skill_type = "dependency"

        self._increment_skill(skill_type, title)

    def _update_skill_from_issue(self, issue_data: Dict):
        """从Issue数据中提取并更新技能模式"""
        title = issue_data.get("title", "").lower()
        labels = issue_data.get("labels", [])

        skill_type = "general"
        if any(l.get("name") == "bug" for l in labels):
            skill_type = "bug_report"
        elif any(l.get("name") == "enhancement" for l in labels):
            skill_type = "feature_request"
        elif any(l.get("name") == "question" for l in labels):
            skill_type = "question"

        self._increment_skill(skill_type, title)

    def _increment_skill(self, skill_type: str, keywords: str):
        """增加技能使用计数"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO skill_patterns (pattern_type, trigger_keywords, success_count, last_used, created_at, updated_at)
            VALUES (?, ?, 1, ?, ?, ?)
        """, (skill_type, keywords, datetime.utcnow().isoformat(),
              datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))

        conn.commit()
        conn.close()

    def get_response_template(self, template_type: str, keywords: List[str] = None) -> Optional[str]:
        """获取最合适的响应模板"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if keywords:
            keyword_match = " OR ".join([f"keywords LIKE '%{k}%'" for k in keywords])
            cursor.execute(f"""
                SELECT template_content, usage_count, avg_feedback
                FROM response_templates
                WHERE template_type = ? AND ({keyword_match})
                ORDER BY usage_count DESC, avg_feedback DESC
                LIMIT 1
            """, (template_type,))
        else:
            cursor.execute("""
                SELECT template_content, usage_count, avg_feedback
                FROM response_templates
                WHERE template_type = ?
                ORDER BY usage_count DESC, avg_feedback DESC
                LIMIT 1
            """, (template_type,))

        result = cursor.fetchone()
        conn.close()

        if result:
            return result[0]
        return None

    def get_skill_stats(self) -> Dict:
        """获取技能统计"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT pattern_type, SUM(success_count) as total, COUNT(*)
            FROM skill_patterns
            GROUP BY pattern_type
        """)

        stats = {}
        for row in cursor.fetchall():
            stats[row[0]] = {"total_uses": row[1], "patterns": row[2]}

        conn.close()
        return stats

    def get_recent_learning_stats(self, days: int = 7) -> Dict:
        """获取最近学习统计"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        since_date = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")

        cursor.execute("""
            SELECT
                COUNT(*) as total_pr,
                SUM(CASE WHEN merged = 1 THEN 1 ELSE 0 END) as merged,
                SUM(CASE WHEN auto_merged = 1 THEN 1 ELSE 0 END) as auto_merged
            FROM pr_history
            WHERE created_at >= ?
        """, (since_date,))

        pr_stats = cursor.fetchone()

        cursor.execute("""
            SELECT
                COUNT(*) as total_issues,
                SUM(CASE WHEN closed = 1 THEN 1 ELSE 0 END) as closed
            FROM issue_history
            WHERE created_at >= ?
        """, (since_date,))

        issue_stats = cursor.fetchone()

        conn.close()

        return {
            "period_days": days,
            "pr_processed": pr_stats[0] or 0,
            "pr_merged": pr_stats[1] or 0,
            "pr_auto_merged": pr_stats[2] or 0,
            "issues_processed": issue_stats[0] or 0,
            "issues_closed": issue_stats[1] or 0
        }

    def get_common_patterns(self, limit: int = 10) -> List[Dict]:
        """获取最常用的模式"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT pattern_type, trigger_keywords, success_count, last_used
            FROM skill_patterns
            ORDER BY success_count DESC
            LIMIT ?
        """, (limit,))

        patterns = []
        for row in cursor.fetchall():
            patterns.append({
                "type": row[0],
                "keywords": row[1],
                "uses": row[2],
                "last_used": row[3]
            })

        conn.close()
        return patterns


# 全局单例
_memory_store = None


def get_memory_store() -> AIMemoryStore:
    """获取记忆存储单例"""
    global _memory_store
    if _memory_store is None:
        _memory_store = AIMemoryStore()
    return _memory_store
