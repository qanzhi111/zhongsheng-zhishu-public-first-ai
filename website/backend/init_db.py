#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
众生智枢数据库初始化脚本
"""

import sys
import os
from pathlib import Path

# 添加 backend 目录到路径
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, text
from models import Base, AIDecision, PublicVote, AuditLog, ViolationReport, EmergencyAlert
from datetime import datetime, timezone

def init_database():
    """初始化数据库"""
    # 获取数据库URL
    database_url = os.getenv("DATABASE_URL")
    
    if database_url:
        if database_url.startswith("sqlite"):
            engine = create_engine(database_url, connect_args={"check_same_thread": False})
        else:
            engine = create_engine(database_url, pool_pre_ping=True)
    else:
        # 开发模式使用SQLite
        DATA_DIR = Path("./data")
        DATA_DIR.mkdir(exist_ok=True)
        DATABASE_URL = f"sqlite:///{DATA_DIR}/zhongsheng.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        
        # 启用WAL模式
        with engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL"))
            conn.execute(text("PRAGMA synchronous=NORMAL"))
            conn.execute(text("PRAGMA foreign_keys=ON"))
            conn.commit()
    
    print(f"数据库连接: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成")
    
    # 插入示例数据
    with engine.connect() as conn:
        # 检查是否已有数据
        result = conn.execute(text("SELECT COUNT(*) FROM ai_decisions")).scalar()
        
        if result == 0:
            print("插入示例数据...")
            
            # 示例决策
            sample_decisions = [
                {
                    "action": "优化医疗资源分配算法",
                    "description": "通过AI算法优化医院间患者转诊流程，减少等待时间",
                    "beneficiaries": "所有患者，特别是偏远地区居民",
                    "public_value_score": 85.5,
                    "rationale": "决策符合为民使命，优先考虑公共医疗资源公平分配",
                    "constraints_passed": True,
                    "is_public": True,
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "action": "建立教育补贴自动审核系统",
                    "description": "使用AI自动审核教育补贴申请，加快审批速度",
                    "beneficiaries": "低收入家庭学生",
                    "public_value_score": 78.3,
                    "rationale": "保护弱势群体教育权益，符合为民使命",
                    "constraints_passed": True,
                    "is_public": True,
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "action": "社区安全监控预警系统升级",
                    "description": "升级社区监控设备，提高犯罪预防能力",
                    "beneficiaries": "所有社区居民",
                    "public_value_score": 82.0,
                    "rationale": "保障公共安全，维护社会秩序",
                    "constraints_passed": True,
                    "is_public": True,
                    "created_at": datetime.now(timezone.utc)
                }
            ]
            
            for decision in sample_decisions:
                conn.execute(
                    text("""
                        INSERT INTO ai_decisions 
                        (action, description, beneficiaries, public_value_score, rationale, 
                         constraints_passed, is_public, created_at)
                        VALUES 
                        (:action, :description, :beneficiaries, :public_value_score, :rationale,
                         :constraints_passed, :is_public, :created_at)
                    """),
                    decision
                )
            
            # 示例投票
            sample_votes = [
                {
                    "vote_type": "DECISION_REVIEW",
                    "decision_id": 1,
                    "voter_id": "voter_001",
                    "vote_choice": "approve",
                    "reason": "有利于改善医疗服务",
                    "is_anonymous": False,
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "vote_type": "DECISION_REVIEW",
                    "decision_id": 1,
                    "voter_id": "voter_002",
                    "vote_choice": "approve",
                    "reason": "支持AI辅助医疗",
                    "is_anonymous": True,
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "vote_type": "DECISION_REVIEW",
                    "decision_id": 2,
                    "voter_id": "voter_003",
                    "vote_choice": "approve",
                    "reason": "教育公平很重要",
                    "is_anonymous": False,
                    "created_at": datetime.now(timezone.utc)
                }
            ]
            
            for vote in sample_votes:
                conn.execute(
                    text("""
                        INSERT INTO public_votes
                        (vote_type, decision_id, voter_id, vote_choice, reason, is_anonymous, created_at)
                        VALUES
                        (:vote_type, :decision_id, :voter_id, :vote_choice, :reason, :is_anonymous, :created_at)
                    """),
                    vote
                )
            
            conn.commit()
            print("示例数据插入完成")
        else:
            print(f"数据库已有 {result} 条决策记录，跳过示例数据插入")
    
    print("数据库初始化完成！")

if __name__ == "__main__":
    init_database()
