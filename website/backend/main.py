#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
众生智枢 - 全民民主监督平台后端 (修复版)
ZhongSheng ZhiShu - Public Democratic Oversight Platform Backend (Fixed)
"""

from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, event, Index, UniqueConstraint, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from datetime import datetime, timezone
from typing import Generator, Optional
import json
import os
from pathlib import Path
from collections import defaultdict
from functools import wraps
import time

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
# Rate Limiting Middleware
# ============================================================================

class RateLimiter:
    """基于IP的请求频率限制"""
    
    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: dict = defaultdict(list)
    
    def is_allowed(self, client_ip: str) -> bool:
        """检查是否允许请求"""
        now = time.time()
        # 清理过期记录
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] 
            if now - t < self.window_seconds
        ]
        
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
        
        self.requests[client_ip].append(now)
        return True
    
    def get_remaining(self, client_ip: str) -> int:
        """获取剩余请求次数"""
        now = time.time()
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] 
            if now - t < self.window_seconds
        ]
        return max(0, self.max_requests - len(self.requests[client_ip]))

rate_limiter = RateLimiter(max_requests=30, window_seconds=60)

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting中间件"""
    client_ip = request.client.host if request.client else "unknown"
    
    # 只对POST请求进行限流
    if request.method == "POST":
        if not rate_limiter.is_allowed(client_ip):
            return Response(
                content=json.dumps({
                    "detail": "请求过于频繁，请稍后再试",
                    "error_code": "RATE_LIMIT_EXCEEDED",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }),
                status_code=429,
                media_type="application/json"
            )
    
    response = await call_next(request)
    return response

# ============================================================================
# 数据库配置
# ============================================================================

def get_database_url() -> str:
    """获取数据库URL，优先使用PostgreSQL"""
    # 1. 优先使用DATABASE_URL环境变量
    if os.getenv("DATABASE_URL"):
        return os.getenv("DATABASE_URL")
    
    # 2. 检查是否明确配置使用PostgreSQL
    if os.getenv("DB_TYPE", "").lower() == "postgres":
        pg_host = os.getenv("POSTGRES_HOST", "localhost")
        pg_port = os.getenv("POSTGRES_PORT", "5432")
        pg_user = os.getenv("POSTGRES_USER", "postgres")
        pg_password = os.getenv("POSTGRES_PASSWORD", "postgres")
        pg_db = os.getenv("POSTGRES_DB", "zhongsheng")
        return f"postgresql://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_db}"
    
    # 3. 降级使用SQLite（开发模式）
    DATA_DIR = Path("/app/data") if os.path.exists("/app") else Path("./data")
    DATA_DIR.mkdir(exist_ok=True)
    return f"sqlite:///{DATA_DIR}/zhongsheng.db"

def create_engine_with_settings(database_url: str):
    """根据数据库类型创建engine"""
    if database_url.startswith("sqlite"):
        # SQLite配置：启用WAL模式
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            echo=False
        )
        
        @event.listens_for(engine, "connect")
        def set_sqlite_pragma(dbapi_conn, connection_record):
            cursor = dbapi_conn.cursor()
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
        
        return engine
    else:
        # PostgreSQL配置
        return create_engine(
            database_url,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            echo=False
        )

DATABASE_URL = get_database_url()
engine = create_engine_with_settings(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 创建表
Base.metadata.create_all(bind=engine)

# ============================================================================
# 初始化应用
# ============================================================================

app = FastAPI(
    title="众生智枢 · 全民民主监督平台",
    description="Public-First AI Democratic Oversight Platform",
    version="1.1.0"
)

# CORS配置：从环境变量读取
def get_cors_origins() -> list:
    """获取CORS允许的来源"""
    cors_env = os.getenv("CORS_ORIGINS", "")
    if cors_env:
        return [origin.strip() for origin in cors_env.split(",") if origin.strip()]
    # 默认允许所有来源（开发模式）
    return ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加rate limiting中间件
app.middleware("http")(rate_limit_middleware)

# 初始化核心模块
mission = PublicFirstAIMission()
value_assessment = PublicInterestValueAssessment()
constraint_engine = DecisionConstraintEngine()
oversight = PublicOversightInterface()

# ============================================================================
# 全局异常处理
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTTP异常处理"""
    return Response(
        content=json.dumps({
            "detail": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, ensure_ascii=False),
        status_code=exc.status_code,
        media_type="application/json"
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """通用异常处理"""
    # 记录到审计日志
    return Response(
        content=json.dumps({
            "detail": "服务器内部错误",
            "error_code": "INTERNAL_ERROR",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, ensure_ascii=False),
        status_code=500,
        media_type="application/json"
    )

# ============================================================================
# API路由 - 健康检查
# ============================================================================

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "system": "众生智枢民主监督平台",
        "version": "1.1.0",
        "database": "postgresql" if DATABASE_URL.startswith("postgresql") else "sqlite"
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
        decision_dict = decision_data.model_dump()
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
                decision_id="emergency_" + str(datetime.now(timezone.utc).timestamp()),
                violation_type=violations[0] if violations else "unknown",
                severity="CRITICAL",
                description=json.dumps(emergency_response, ensure_ascii=False),
                status="ACTIVE",
                created_at=datetime.now(timezone.utc)
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
            created_at=datetime.now(timezone.utc)
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
            timestamp=datetime.now(timezone.utc)
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
    ).order_by(AIDecision.created_at.desc()).offset(skip).limit(limit).all()
    
    total = db.query(AIDecision).filter(
        AIDecision.is_public == True
    ).count()
    
    return {
        "decisions": [
            {
                "id": d.id,
                "action": d.action,
                "description": d.description,
                "beneficiaries": d.beneficiaries,
                "public_value_score": d.public_value_score,
                "constraints_passed": d.constraints_passed,
                "created_at": d.created_at.isoformat() if d.created_at else None
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
        "is_public": decision.is_public,
        "created_at": decision.created_at.isoformat() if decision.created_at else None
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
    - POLICY_CHANGE: 政策变更
    """
    try:
        # 防重复投票检查：同一投票者对同一决策的同一选择只能投一次
        existing_vote = db.query(PublicVote).filter(
            PublicVote.voter_id == vote_data.voter_id,
            PublicVote.decision_id == vote_data.decision_id,
            PublicVote.vote_type == vote_data.vote_type.value if hasattr(vote_data.vote_type, 'value') else vote_data.vote_type
        ).first()
        
        if existing_vote:
            raise HTTPException(
                status_code=409,
                detail="您已经对这项决策投过票了，不能重复投票"
            )
        
        vote_type_value = vote_data.vote_type.value if hasattr(vote_data.vote_type, 'value') else vote_data.vote_type
        
        vote = PublicVote(
            vote_type=vote_type_value,
            decision_id=vote_data.decision_id,
            voter_id=vote_data.voter_id,
            vote_choice=vote_data.vote_choice.value if hasattr(vote_data.vote_choice, 'value') else vote_data.vote_choice,
            reason=vote_data.reason,
            is_anonymous=vote_data.is_anonymous,
            created_at=datetime.now(timezone.utc)
        )
        db.add(vote)
        db.commit()
        db.refresh(vote)
        
        # 记录审计日志
        audit_log = AuditLog(
            vote_id=vote.id,
            action="VOTE_CREATED",
            description=f"新投票已创建: {vote_type_value}",
            severity="INFO",
            timestamp=datetime.now(timezone.utc)
        )
        db.add(audit_log)
        db.commit()
        
        return {
            "vote_id": vote.id,
            "status": "recorded",
            "created_at": vote.created_at.isoformat() if vote.created_at else None
        }
    except HTTPException:
        raise
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

@app.get("/api/votes/overview")
async def get_votes_overview(db: Session = Depends(get_db)):
    """
    获取所有决策的投票概览（修复：不再只看第一条决策）
    """
    # 获取所有决策
    decisions = db.query(AIDecision).filter(
        AIDecision.is_public == True
    ).all()
    
    overview = []
    for decision in decisions:
        votes = db.query(PublicVote).filter(
            PublicVote.decision_id == decision.id
        ).all()
        
        approve_count = len([v for v in votes if v.vote_choice == "approve"])
        reject_count = len([v for v in votes if v.vote_choice == "reject"])
        abstain_count = len([v for v in votes if v.vote_choice == "abstain"])
        total = len(votes)
        
        overview.append({
            "decision_id": decision.id,
            "decision_action": decision.action,
            "total_votes": total,
            "approve": approve_count,
            "reject": reject_count,
            "abstain": abstain_count,
            "approval_rate": (approve_count / total * 100) if total > 0 else 0
        })
    
    # 汇总统计
    total_votes = sum(item["total_votes"] for item in overview)
    total_approve = sum(item["approve"] for item in overview)
    
    return {
        "decisions": overview,
        "summary": {
            "total_decisions": len(overview),
            "total_votes": total_votes,
            "overall_approval_rate": (total_approve / total_votes * 100) if total_votes > 0 else 0
        }
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
        severity_value = violation_data.severity.value if hasattr(violation_data.severity, 'value') else violation_data.severity
        
        violation = ViolationReport(
            decision_id=violation_data.decision_id,
            violated_law=violation_data.violated_law,
            description=violation_data.description,
            severity=severity_value,
            reporter_id=violation_data.reporter_id,
            is_anonymous=violation_data.is_anonymous,
            status="PENDING_REVIEW",
            created_at=datetime.now(timezone.utc)
        )
        db.add(violation)
        db.commit()
        db.refresh(violation)
        
        # 如果是CRITICAL，自动触发紧急熔断
        if severity_value == "CRITICAL":
            alert = EmergencyAlert(
                decision_id=str(violation_data.decision_id) if violation_data.decision_id else "unknown",
                violation_type=violation_data.violated_law,
                severity="CRITICAL",
                description=violation_data.description,
                status="ACTIVE",
                created_at=datetime.now(timezone.utc)
            )
            db.add(alert)
            db.commit()
        
        # 记录审计日志
        audit_log = AuditLog(
            violation_id=violation.id,
            action="VIOLATION_REPORTED",
            description=f"违反报告已提交: {violation_data.violated_law}",
            severity=severity_value,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(audit_log)
        db.commit()
        
        return {
            "violation_id": violation.id,
            "status": "submitted",
            "created_at": violation.created_at.isoformat() if violation.created_at else None
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
    violations = db.query(ViolationReport).order_by(
        ViolationReport.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    total = db.query(ViolationReport).count()
    
    return {
        "violations": [
            {
                "id": v.id,
                "decision_id": v.decision_id,
                "violated_law": v.violated_law,
                "description": v.description,
                "severity": v.severity,
                "status": v.status,
                "reporter_id": v.reporter_id if not v.is_anonymous else "anonymous",
                "is_anonymous": v.is_anonymous,
                "created_at": v.created_at.isoformat() if v.created_at else None
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
                "decision_id": log.decision_id,
                "vote_id": log.vote_id,
                "violation_id": log.violation_id,
                "action": log.action,
                "description": log.description,
                "severity": log.severity,
                "timestamp": log.timestamp.isoformat() if log.timestamp else None
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
        "timestamp": datetime.now(timezone.utc).isoformat()
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
    ).order_by(EmergencyAlert.created_at.desc()).all()
    
    return {
        "active_alerts": len(alerts),
        "alerts": [
            {
                "id": alert.id,
                "decision_id": alert.decision_id,
                "violation_type": alert.violation_type,
                "severity": alert.severity,
                "description": alert.description,
                "status": alert.status,
                "created_at": alert.created_at.isoformat() if alert.created_at else None
            }
            for alert in alerts
        ]
    }

@app.post("/api/emergency-alerts/{alert_id}/resolve")
async def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    """
    解决紧急警报
    """
    alert = db.query(EmergencyAlert).filter(
        EmergencyAlert.id == alert_id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="警报未找到")
    
    alert.status = "RESOLVED"
    alert.resolved_at = datetime.now(timezone.utc)
    db.commit()
    
    # 记录审计日志
    audit_log = AuditLog(
        violation_id=alert_id,
        action="ALERT_RESOLVED",
        description=f"紧急警报已解决: {alert.violation_type}",
        severity="INFO",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(audit_log)
    db.commit()
    
    return {
        "alert_id": alert_id,
        "status": "resolved",
        "resolved_at": alert.resolved_at.isoformat() if alert.resolved_at else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
