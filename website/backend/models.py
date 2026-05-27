#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据模型 - SQLAlchemy ORM
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class AIDecision(Base):
    """AI决策记录"""
    __tablename__ = "ai_decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(255), nullable=False)
    description = Column(Text)
    beneficiaries = Column(String(255))
    public_value_score = Column(Float, default=0.0)
    rationale = Column(Text)
    constraints_passed = Column(Boolean, default=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PublicVote(Base):
    """民主投票记录"""
    __tablename__ = "public_votes"
    
    id = Column(Integer, primary_key=True, index=True)
    vote_type = Column(String(50), nullable=False)
    decision_id = Column(Integer, nullable=True)
    voter_id = Column(String(255), nullable=False)
    vote_choice = Column(String(50), nullable=False)
    reason = Column(Text)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    """审计日志"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, nullable=True)
    vote_id = Column(Integer, nullable=True)
    violation_id = Column(Integer, nullable=True)
    action = Column(String(255), nullable=False)
    description = Column(Text)
    severity = Column(String(50), default="INFO")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class ViolationReport(Base):
    """违反报告"""
    __tablename__ = "violation_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, nullable=True)
    violated_law = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False)
    reporter_id = Column(String(255), nullable=False)
    is_anonymous = Column(Boolean, default=False)
    status = Column(String(50), default="PENDING_REVIEW")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EmergencyAlert(Base):
    """紧急警报"""
    __tablename__ = "emergency_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String(255), nullable=True)
    violation_type = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
