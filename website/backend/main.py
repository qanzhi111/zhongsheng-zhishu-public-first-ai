#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
众生智枢 - 全民民主监督平台后端
ZhongSheng ZhiShu - Public Democratic Oversight Platform Backend
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import json
import os
from pathlib import Path

# 导入数据模型
from models import (
    Base,
    AIDecision,
    PublicVote,
    AuditLog,
    ViolationReport,
    EmergencyAlert
)
from schemas import (
    DecisionCreate,
    VoteCreate,
    ViolationReportCreate
)
from core import (
    PublicFirstAIMission,
    PublicInterestValueAssessment,
    DecisionConstraintEngine,
    PublicOversightInterface
)

# ============================================================================
# 初始化应用
# ============================================================================

app = FastAPI(
    title="众生智枢 · 全民民主监督平台",
    description="Public-First AI Democratic Oversight Platform",
    version="1.0.0"
)

# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# 数据库配置
# ============================================================================

DATA_DIR = Path("/app/data") if os.path.exists("/app") else Path("./data")
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR}/zhongsheng.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建表
Base.metadata.create_all(bind=engine)

# ============================================================================
# 依赖注入
# ============================================================================

def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 初始化核心模块
mission = PublicFirstAIMission()
value_assessment = PublicInterestValueAssessment()
constraint_engine = DecisionConstraintEngine()
oversight = PublicOversightInterface()

# ============================================================================
# API路由 - 健康检查
# ============================================================================

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "system": "众生智枢民主监督平台"
    }

# ============================================================================
# API路由 - AI决策管理
# ============================================================================

@app.post("/api/decisions")
async def create_decision(
    decision_data: DecisionCreate,
    db: Session = Depends(get_db)
):
    """
    创建新的AI决策记录
    
    这会经过完整的为民价值评估和约束检查
    """
    try:
        # 1. 检查硬约束
        decision_dict = decision_data.dict()
        passes_constraints, violations = constraint_engine.check_hard_constraints(
            decision_dict
        )
        
        if not passes_constraints:
            # 触发紧急熔断
            emergency_response = constraint_engine.trigger_emergency_brake(
                violations[0] if violations else "unknown",
                decision_dict
            )
            
            # 记录紧急警报
            alert = EmergencyAlert(
                decision_id="emergency_" + str(datetime.now().timestamp()),
                violation_type=violations[0] if violations else "unknown",
                severity="CRITICAL",
                description=json.dumps(emergency_response),
                status="ACTIVE",
                created_at=datetime.now()
            )
            db.add(alert)
            db.commit()
            
            raise HTTPException(
                status_code=403,
                detail={
                    "status": "EMERGENCY_HALT",
                    "violations": violations,
                    "message": "决策违反硬约束，已触发紧急熔断"
                }
            )
        
        # 2. 验证为民使命对齐
        if not mission.verify_mission_alignment(decision_dict):
            raise HTTPException(
                status_code=400,
                detail="决策不符合为民使命"
            )
        
        # 3. 评估公共价值
        public_value_score = value_assessment.calculate_public_value(decision_dict)
        
        # 4. 生成可解释的理由
        rationale = mission.get_decision_rationale(decision_dict)
        
        # 5. 保存到数据库
        db_decision = AIDecision(
            action=decision_data.action,
            description=decision_data.description,
            beneficiaries=decision_data.beneficiaries,
            public_value_score=public_value_score,
            rationale=rationale,
            constraints_passed=True,
            is_public=True,
            created_at=datetime.now()
        )
        db.add(db_decision)
        db.commit()
        db.refresh(db_decision)
        
        # 6. 记录审计日志
        audit_log = AuditLog(
            decision_id=db_decision.id,
            action="DECISION_CREATED",
            description=f"新决策已创建并通过审查: {decision_data.action}",
            severity="INFO",
            timestamp=datetime.now()
        )
        db.add(audit_log)
        db.commit()
        
        return {
            "status": "APPROVED",
            "decision_id": db_decision.id,
            "public_value_score": public_value_score,
            "rationale": rationale,
            "created_at": db_decision.created_at.isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/decisions")
async def list_decisions(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取所有公开的AI决策列表
    """
    decisions = db.query(AIDecision).filter(
        AIDecision.is_public == True
    ).offset(skip).limit(limit).all()
    
    total = db.query(AIDecision).filter(
        AIDecision.is_public == True
    ).count()
    
    return {
        "decisions": [
            {
                "id": d.id,
                "action": d.action,
                "description": d.description,
                "public_value_score": d.public_value_score,
                "constraints_passed": d.constraints_passed,
                "created_at": d.created_at.isoformat()
            }
            for d in decisions
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/decisions/{decision_id}")
async def get_decision(
    decision_id: int,
    db: Session = Depends(get_db)
):
    """
    获取单个决策的详细信息
    """
    decision = db.query(AIDecision).filter(
        AIDecision.id == decision_id
    ).first()
    
    if not decision:
        raise HTTPException(status_code=404, detail="决策未找到")
    
    return {
        "id": decision.id,
        "action": decision.action,
        "description": decision.description,
        "beneficiaries": decision.beneficiaries,
        "public_value_score": decision.public_value_score,
        "rationale": decision.rationale,
        "constraints_passed": decision.constraints_passed,
        "created_at": decision.created_at.isoformat()
    }

# ============================================================================
# API路由 - 民主投票
# ============================================================================

@app.post("/api/votes")
async def create_vote(
    vote_data: VoteCreate,
    db: Session = Depends(get_db)
):
    """
    创建民主投票
    
    支持投票类型：
    - EMERGENCY_VETO: 紧急否决（投诉违反铁律）
    - DECISION_REVIEW: 决策审查
    - SANCTION_VOTE: 制裁执行
    """
    try:
        vote = PublicVote(
            vote_type=vote_data.vote_type,
            decision_id=vote_data.decision_id,
            voter_id=vote_data.voter_id,
            vote_choice=vote_data.vote_choice,  # "approve", "reject", "abstain"
            reason=vote_data.reason,
            is_anonymous=vote_data.is_anonymous,
            created_at=datetime.now()
        )
        db.add(vote)
        db.commit()
        db.refresh(vote)
        
        # 记录审计日志
        audit_log = AuditLog(
            vote_id=vote.id,
            action="VOTE_CREATED",
            description=f"新投票已创建: {vote_data.vote_type}",
            severity="INFO",
            timestamp=datetime.now()
        )
        db.add(audit_log)
        db.commit()
        
        return {
            "vote_id": vote.id,
            "status": "recorded",
            "created_at": vote.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/votes/statistics/{decision_id}")
async def get_vote_statistics(
    decision_id: int,
    db: Session = Depends(get_db)
):
    """
    获取某个决策的投票统计
    """
    votes = db.query(PublicVote).filter(
        PublicVote.decision_id == decision_id
    ).all()
    
    approve_count = len([v for v in votes if v.vote_choice == "approve"])
    reject_count = len([v for v in votes if v.vote_choice == "reject"])
    abstain_count = len([v for v in votes if v.vote_choice == "abstain"])
    total = len(votes)
    
    return {
        "decision_id": decision_id,
        "total_votes": total,
        "approve": approve_count,
        "reject": reject_count,
        "abstain": abstain_count,
        "approval_rate": (approve_count / total * 100) if total > 0 else 0
    }

# ============================================================================
# API路由 - 违反报告
# ============================================================================

@app.post("/api/violations")
async def report_violation(
    violation_data: ViolationReportCreate,
    db: Session = Depends(get_db)
):
    """
    提交违反铁律的投诉
    """
    try:
        violation = ViolationReport(
            decision_id=violation_data.decision_id,
            violated_law=violation_data.violated_law,
            description=violation_data.description,
            severity=violation_data.severity,  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
            reporter_id=violation_data.reporter_id,
            is_anonymous=violation_data.is_anonymous,
            status="PENDING_REVIEW",
            created_at=datetime.now()
        )
        db.add(violation)
        db.commit()
        db.refresh(violation)
        
        # 如果是CRITICAL，自动触发紧急熔断
        if violation_data.severity == "CRITICAL":
            alert = EmergencyAlert(
                decision_id=str(violation_data.decision_id),
                violation_type=violation_data.violated_law,
                severity="CRITICAL",
                description=violation_data.description,
                status="ACTIVE",
                created_at=datetime.now()
            )
            db.add(alert)
            db.commit()
        
        # 记录审计日志
        audit_log = AuditLog(
            violation_id=violation.id,
            action="VIOLATION_REPORTED",
            description=f"违反报告已提交: {violation_data.violated_law}",
            severity=violation_data.severity,
            timestamp=datetime.now()
        )
        db.add(audit_log)
        db.commit()
        
        return {
            "violation_id": violation.id,
            "status": "submitted",
            "created_at": violation.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/violations")
async def list_violations(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取所有违反报告
    """
    violations = db.query(ViolationReport).offset(skip).limit(limit).all()
    total = db.query(ViolationReport).count()
    
    return {
        "violations": [
            {
                "id": v.id,
                "violated_law": v.violated_law,
                "description": v.description,
                "severity": v.severity,
                "status": v.status,
                "created_at": v.created_at.isoformat()
            }
            for v in violations
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }

# ============================================================================
# API路由 - 审计系统
# ============================================================================

@app.get("/api/audit-logs")
async def get_audit_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    获取审计日志（完全透明）
    """
    logs = db.query(AuditLog).order_by(
        AuditLog.timestamp.desc()
    ).offset(skip).limit(limit).all()
    
    total = db.query(AuditLog).count()
    
    return {
        "logs": [
            {
                "id": log.id,
                "action": log.action,
                "description": log.description,
                "severity": log.severity,
                "timestamp": log.timestamp.isoformat()
            }
            for log in logs
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/dashboard-stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    获取仪表板统计数据
    """
    total_decisions = db.query(AIDecision).count()
    total_votes = db.query(PublicVote).count()
    total_violations = db.query(ViolationReport).count()
    active_alerts = db.query(EmergencyAlert).filter(
        EmergencyAlert.status == "ACTIVE"
    ).count()
    
    avg_score = db.query(
        db.func.avg(AIDecision.public_value_score)
    ).scalar() or 0
    
    return {
        "total_decisions": total_decisions,
        "total_votes": total_votes,
        "total_violations": total_violations,
        "active_alerts": active_alerts,
        "average_public_value_score": round(float(avg_score), 2),
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# API路由 - 紧急情况
# ============================================================================

@app.get("/api/emergency-alerts")
async def get_emergency_alerts(db: Session = Depends(get_db)):
    """
    获取所有紧急警报
    """
    alerts = db.query(EmergencyAlert).filter(
        EmergencyAlert.status == "ACTIVE"
    ).all()
    
    return {
        "active_alerts": len(alerts),
        "alerts": [
            {
                "id": alert.id,
                "violation_type": alert.violation_type,
                "severity": alert.severity,
                "description": alert.description,
                "created_at": alert.created_at.isoformat()
            }
            for alert in alerts
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
