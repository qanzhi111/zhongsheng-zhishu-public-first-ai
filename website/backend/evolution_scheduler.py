#!/usr/bin/env python3
"""
众生智枢 · 自进化调度器
调度和管理自进化任务
"""

import os
import time
import threading
import schedule
from datetime import datetime, timedelta
from typing import Callable, Dict, List
import json
import sqlite3


class EvolutionScheduler:
    """
    自进化任务调度器

    支持：
    - 定时任务（每日、每周）
    - 事件触发任务
    - 持续学习循环
    """

    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "evolution.db")
        self.db_path = db_path

        self.tasks: Dict[str, Callable] = {}
        self.running = False
        self.thread = None

        # 初始化任务
        self._register_default_tasks()

    def _register_default_tasks(self):
        """注册默认任务"""
        self.tasks = {
            "daily_learning": self._daily_learning,
            "pattern_analysis": self._pattern_analysis,
            "knowledge_refinement": self._knowledge_refinement,
            "stats_update": self._update_statistics,
            "cleanup": self._cleanup_old_data
        }

    def _daily_learning(self):
        """每日学习任务"""
        print(f"[{datetime.now().isoformat()}] 执行每日学习...")

        try:
            from evolution_engine import get_evolution_engine
            engine = get_evolution_engine()

            # 从GitHub收集的数据中学习
            from github_collector import get_github_collector
            collector = get_github_collector()

            # 获取近期数据
            data = collector.get_learning_data(days=7)

            # 更新进化引擎
            refined = engine.refine_knowledge()

            print(f"[{datetime.now().isoformat()}] 学习完成: {refined}")
            return True
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] 学习失败: {e}")
            return False

    def _pattern_analysis(self):
        """模式分析任务"""
        print(f"[{datetime.now().isoformat()}] 执行模式分析...")

        try:
            from evolution_engine import get_evolution_engine
            engine = get_evolution_engine()

            # 获取趋势
            trends = engine.get_trending_topics(days=7)

            print(f"[{datetime.now().isoformat()}] 发现 {len(trends)} 个热门模式")
            for trend in trends[:5]:
                print(f"  - {trend['pattern']}: {trend['occurrences']}次")

            return True
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] 模式分析失败: {e}")
            return False

    def _knowledge_refinement(self):
        """知识精炼任务"""
        print(f"[{datetime.now().isoformat()}] 执行知识精炼...")

        try:
            from evolution_engine import get_evolution_engine
            engine = get_evolution_engine()

            # 精炼知识
            refined = engine.refine_knowledge()

            print(f"[{datetime.now().isoformat()}] 精炼完成:")
            print(f"  - 清理低效知识: {refined['low_efficiency_removed']}条")
            print(f"  - 合并模式: {refined['patterns_merged']}个")
            print(f"  - 更新模板: {refined['templates_updated']}个")

            return True
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] 知识精炼失败: {e}")
            return False

    def _update_statistics(self):
        """更新统计数据"""
        print(f"[{datetime.now().isoformat()}] 更新统计数据...")

        try:
            from github_collector import get_github_collector
            collector = get_github_collector()

            stats = collector.get_learning_data(days=1)

            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            today = datetime.now().strftime("%Y-%m-%d")

            cursor.execute("""
                INSERT INTO statistics (
                    stat_date, pr_processed, pr_merged,
                    issue_processed, issue_closed,
                    auto_response_count, evolution_cycles
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(stat_date) DO UPDATE SET
                pr_processed = pr_processed,
                pr_merged = pr_merged,
                issue_processed = issue_processed,
                issue_closed = issue_closed
            """, (
                today,
                stats["pr_stats"]["total"],
                stats["pr_stats"]["merged"],
                stats["issue_stats"]["total"],
                stats["issue_stats"]["closed"],
                0,  # auto_response_count
                1   # evolution_cycles
            ))

            conn.commit()
            conn.close()

            print(f"[{datetime.now().isoformat()}] 统计更新完成")
            return True
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] 统计更新失败: {e}")
            return False

    def _cleanup_old_data(self):
        """清理旧数据"""
        print(f"[{datetime.now().isoformat()}] 清理旧数据...")

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # 删除30天前的低效经验
            thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

            cursor.execute("""
                DELETE FROM evolution_experience
                WHERE created_at < ?
                AND effectiveness_score < 0.3
                AND success_count + failure_count > 10
            """, (thirty_days_ago,))

            deleted = cursor.rowcount

            conn.commit()
            conn.close()

            print(f"[{datetime.now().isoformat()}] 清理完成: 删除{deleted}条低效经验")
            return True
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] 清理失败: {e}")
            return False

    # ============================================================
    # 调度管理
    # ============================================================

    def schedule_daily(self, task_name: str, time_str: str = "02:00"):
        """
        调度每日任务

        Args:
            task_name: 任务名称
            time_str: 时间 (HH:MM格式)
        """
        if task_name not in self.tasks:
            print(f"未知任务: {task_name}")
            return

        task = self.tasks[task_name]

        if task_name == "daily_learning":
            schedule.every().day.at(time_str).do(task)
        elif task_name == "pattern_analysis":
            schedule.every().day.at(time_str).do(task)
        elif task_name == "knowledge_refinement":
            schedule.every().day.at(time_str).do(task)
        elif task_name == "stats_update":
            schedule.every().day.at(time_str).do(task)
        elif task_name == "cleanup":
            schedule.every().day.at(time_str).do(task)

        print(f"已调度每日任务 '{task_name}' 于 {time_str}")

    def schedule_weekly(self, task_name: str, day: str = "monday", time_str: str = "02:00"):
        """调度每周任务"""
        if task_name not in self.tasks:
            print(f"未知任务: {task_name}")
            return

        task = self.tasks[task_name]

        day_method = getattr(schedule.every(), day, None)
        if day_method:
            day_method().at(time_str).do(task)
            print(f"已调度每周任务 '{task_name}' 于 {day} {time_str}")

    def run_continuously(self, interval: int = 60):
        """
        持续运行调度器

        Args:
            interval: 检查间隔（秒）
        """
        self.running = True

        print(f"[{datetime.now().isoformat()}] 自进化调度器启动")
        print("=" * 50)
        print("调度任务:")
        for job in schedule.get_jobs():
            print(f"  - {job}")
        print("=" * 50)

        def run():
            while self.running:
                schedule.run_pending()
                time.sleep(interval)

        self.thread = threading.Thread(target=run, daemon=True)
        self.thread.start()

    def stop(self):
        """停止调度器"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        print(f"[{datetime.now().isoformat()}] 自进化调度器已停止")

    def get_status(self) -> Dict:
        """获取调度器状态"""
        return {
            "running": self.running,
            "scheduled_tasks": [
                {"task": job.job_func.__name__, "next_run": job.next_run}
                for job in schedule.get_jobs()
            ],
            "available_tasks": list(self.tasks.keys())
        }

    def trigger_task(self, task_name: str) -> bool:
        """手动触发任务"""
        if task_name not in self.tasks:
            print(f"未知任务: {task_name}")
            return False

        print(f"[{datetime.now().isoformat()}] 手动触发任务: {task_name}")
        result = self.tasks[task_name]()
        return result if result else False


def main():
    """主函数 - 启动调度器"""
    import argparse

    parser = argparse.ArgumentParser(description="众生智枢自进化调度器")
    parser.add_argument("--once", action="store_true", help="运行一次所有任务然后退出")
    parser.add_argument("--task", type=str, help="运行特定任务")
    parser.add_argument("--status", action="store_true", help="显示状态")

    args = parser.parse_args()

    scheduler = EvolutionScheduler()

    if args.status:
        status = scheduler.get_status()
        print(json.dumps(status, indent=2, default=str))
        return

    if args.task:
        scheduler.trigger_task(args.task)
        return

    if args.once:
        # 运行所有任务一次
        print("运行所有任务一次...")
        for task_name in scheduler.tasks:
            scheduler.trigger_task(task_name)
        return

    # 默认：持续运行
    # 设置默认调度
    scheduler.schedule_daily("daily_learning", "02:00")
    scheduler.schedule_daily("pattern_analysis", "03:00")
    scheduler.schedule_daily("knowledge_refinement", "04:00")
    scheduler.schedule_daily("stats_update", "05:00")
    scheduler.schedule_daily("cleanup", "06:00")

    scheduler.run_continuously(interval=60)

    # 保持主线程运行
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        scheduler.stop()


if __name__ == "__main__":
    main()
