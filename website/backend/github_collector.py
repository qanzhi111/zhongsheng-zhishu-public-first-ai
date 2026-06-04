#!/usr/bin/env python3
"""
众生智枢 · GitHub数据收集器
从GitHub收集数据用于学习
"""

import os
import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import hashlib


class GitHubDataCollector:
    """
    从GitHub收集数据用于AI学习

    收集内容：
    - PR数据（标题、正文、标签、作者、文件变更）
    - Issue数据（标题、正文、标签、作者）
    - 审查历史
    - 合并时间
    """

    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "evolution.db")
        self.db_path = db_path

    def store_pr_data(self, pr_data: Dict) -> bool:
        """存储PR数据"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # 检查是否已存在
            cursor.execute("SELECT id FROM github_prs WHERE pr_number = ?", (pr_data.get("number"),))
            if cursor.fetchone():
                conn.close()
                return False  # 已存在

            cursor.execute("""
                INSERT INTO github_prs (
                    pr_number, title, body, author,
                    labels, state, files_changed,
                    additions, deletions,
                    created_at, merged_at,
                    review_time_hours, raw_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                pr_data.get("number"),
                pr_data.get("title"),
                pr_data.get("body"),
                pr_data.get("user", {}).get("login") if isinstance(pr_data.get("user"), dict) else pr_data.get("user"),
                json.dumps(pr_data.get("labels", [])),
                pr_data.get("state"),
                pr_data.get("changed_files", 0),
                pr_data.get("additions", 0),
                pr_data.get("deletions", 0),
                pr_data.get("created_at"),
                pr_data.get("merged_at"),
                self._calculate_review_time(pr_data),
                json.dumps(pr_data)
            ))

            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"存储PR数据失败: {e}")
            return False

    def store_issue_data(self, issue_data: Dict) -> bool:
        """存储Issue数据"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # 检查是否已存在
            cursor.execute("SELECT id FROM github_issues WHERE issue_number = ?", (issue_data.get("number"),))
            if cursor.fetchone():
                conn.close()
                return False

            cursor.execute("""
                INSERT INTO github_issues (
                    issue_number, title, body, author,
                    labels, state,
                    created_at, closed_at,
                    response_time_hours, raw_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                issue_data.get("number"),
                issue_data.get("title"),
                issue_data.get("body"),
                issue_data.get("user", {}).get("login") if isinstance(issue_data.get("user"), dict) else issue_data.get("user"),
                json.dumps(issue_data.get("labels", [])),
                issue_data.get("state"),
                issue_data.get("created_at"),
                issue_data.get("closed_at"),
                self._calculate_response_time(issue_data),
                json.dumps(issue_data)
            ))

            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"存储Issue数据失败: {e}")
            return False

    def get_learning_data(self, days: int = 7) -> Dict:
        """获取学习数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

        # PR统计
        cursor.execute("""
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN state = 'closed' AND merged_at IS NOT NULL THEN 1 ELSE 0 END) as merged,
                AVG(review_time_hours) as avg_review_time
            FROM github_prs
            WHERE created_at >= ?
        """, (since,))

        pr_stats = cursor.fetchone()

        # Issue统计
        cursor.execute("""
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN state = 'closed' THEN 1 ELSE 0 END) as closed,
                AVG(response_time_hours) as avg_response_time
            FROM github_issues
            WHERE created_at >= ?
        """, (since,))

        issue_stats = cursor.fetchone()

        # PR类型分布
        cursor.execute("""
            SELECT labels, COUNT(*) as count
            FROM github_prs
            WHERE created_at >= ?
            GROUP BY labels
            ORDER BY count DESC
            LIMIT 10
        """, (since,))

        pr_types = cursor.fetchall()

        conn.close()

        return {
            "period_days": days,
            "pr_stats": {
                "total": pr_stats[0] or 0,
                "merged": pr_stats[1] or 0,
                "avg_review_time_hours": round(pr_stats[2] or 0, 1)
            },
            "issue_stats": {
                "total": issue_stats[0] or 0,
                "closed": issue_stats[1] or 0,
                "avg_response_time_hours": round(issue_stats[2] or 0, 1)
            },
            "pr_type_distribution": [
                {"type": p[0], "count": p[1]} for p in pr_types
            ]
        }

    def get_recent_activity(self, limit: int = 50) -> List[Dict]:
        """获取近期活动"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # PR活动
        cursor.execute("""
            SELECT 'pr', pr_number, title, author, state, created_at
            FROM github_prs
            ORDER BY created_at DESC
            LIMIT ?
        """, (limit,))

        prs = [
            {"type": "pr", "number": r[1], "title": r[2], "author": r[3], "state": r[4], "created_at": r[5]}
            for r in cursor.fetchall()
        ]

        # Issues
        cursor.execute("""
            SELECT 'issue', issue_number, title, author, state, created_at
            FROM github_issues
            ORDER BY created_at DESC
            LIMIT ?
        """, (limit,))

        issues = [
            {"type": "issue", "number": r[1], "title": r[2], "author": r[3], "state": r[4], "created_at": r[5]}
            for r in cursor.fetchall()
        ]

        conn.close()

        # 合并并排序
        activities = prs + issues
        activities.sort(key=lambda x: x["created_at"] or "", reverse=True)

        return activities[:limit]

    def _calculate_review_time(self, pr_data: Dict) -> Optional[float]:
        """计算审查时间（小时）"""
        created = pr_data.get("created_at")
        merged = pr_data.get("merged_at")

        if not created or not merged:
            return None

        try:
            created_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            merged_dt = datetime.fromisoformat(merged.replace("Z", "+00:00"))
            return (merged_dt - created_dt).total_seconds() / 3600
        except:
            return None

    def _calculate_response_time(self, issue_data: Dict) -> Optional[float]:
        """计算响应时间（小时）"""
        created = issue_data.get("created_at")
        closed = issue_data.get("closed_at")

        if not created or not closed:
            return None

        try:
            created_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            closed_dt = datetime.fromisoformat(closed.replace("Z", "+00:00"))
            return (closed_dt - created_dt).total_seconds() / 3600
        except:
            return None

    def init_tables(self):
        """初始化GitHub数据表"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # GitHub PRs表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS github_prs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pr_number INTEGER UNIQUE,
                title TEXT,
                body TEXT,
                author TEXT,
                labels TEXT,
                state TEXT,
                files_changed INTEGER,
                additions INTEGER,
                deletions INTEGER,
                created_at TIMESTAMP,
                merged_at TIMESTAMP,
                review_time_hours REAL,
                raw_data TEXT,
                collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # GitHub Issues表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS github_issues (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                issue_number INTEGER UNIQUE,
                title TEXT,
                body TEXT,
                author TEXT,
                labels TEXT,
                state TEXT,
                created_at TIMESTAMP,
                closed_at TIMESTAMP,
                response_time_hours REAL,
                raw_data TEXT,
                collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()
        conn.close()


# 全局单例
_github_collector = None


def get_github_collector() -> GitHubDataCollector:
    """获取GitHub收集器单例"""
    global _github_collector
    if _github_collector is None:
        _github_collector = GitHubDataCollector()
        _github_collector.init_tables()
    return _github_collector
