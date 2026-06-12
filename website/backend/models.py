#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据模型 - SQLAlchemy ORM (修复版)
使用 SQLAlchemy 2.0 的 DeclarativeBase
"""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, Index, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """SQLAlchemy 2.0 基础类"""
    pass

def utc_now():
    """获取当前UTC时间（timezone-aware）"""
    return datetime.now(timezone.utc)

class AIDecision(Base):
    """AI决策记录"""
    __tablename__ = "ai_decisions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    beneficiaries: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    public_value_score: Mapped[float] = mapped_column(Float, default=0.0)
    rationale: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    constraints_passed: Mapped[bool] = mapped_column(Boolean, default=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, onupdate=utc_now)
    
    # 索引定义
    __table_args__ = (
        Index('idx_ai_decisions_public_score', 'is_public', 'public_value_score'),
        Index('idx_ai_decisions_created_at', 'created_at'),
    )

class PublicVote(Base):
    """民主投票记录"""
    __tablename__ = "public_votes"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vote_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    decision_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    voter_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    vote_choice: Mapped[str] = mapped_column(String(50), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    
    # 唯一约束：防止重复投票
    __table_args__ = (
        UniqueConstraint('voter_id', 'decision_id', 'vote_type', name='uq_vote_unique'),
        Index('idx_public_votes_decision_created', 'decision_id', 'created_at'),
    )

class AuditLog(Base):
    """审计日志"""
    __tablename__ = "audit_logs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    decision_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    vote_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    violation_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    action: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    severity: Mapped[str] = mapped_column(String(50), default="INFO", index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    
    __table_args__ = (
        Index('idx_audit_logs_timestamp_desc', 'timestamp'),
    )

class ViolationReport(Base):
    """违反报告"""
    __tablename__ = "violation_reports"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    decision_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    violated_law: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    reporter_id: Mapped[str] = mapped_column(String(255), nullable=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING_REVIEW", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, onupdate=utc_now)
    
    __table_args__ = (
        Index('idx_violation_reports_severity_status', 'severity', 'status'),
        Index('idx_violation_reports_created_at', 'created_at'),
    )

class EmergencyAlert(Base):
    """紧急警报"""
    __tablename__ = "emergency_alerts"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    decision_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    violation_type: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, index=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    __table_args__ = (
        Index('idx_emergency_alerts_status_created', 'status', 'created_at'),
    )
