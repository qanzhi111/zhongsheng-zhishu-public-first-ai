#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据模式定义 - Pydantic模型
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class VoteType(str, Enum):
    """投票类型枚举"""
    EMERGENCY_VETO = "EMERGENCY_VETO"
    DECISION_REVIEW = "DECISION_REVIEW"
    SANCTION_VOTE = "SANCTION_VOTE"
    POLICY_CHANGE = "POLICY_CHANGE"

class VoteChoice(str, Enum):
    """投票选择枚举"""
    APPROVE = "approve"
    REJECT = "reject"
    ABSTAIN = "abstain"

class SeverityLevel(str, Enum):
    """严重程度枚举"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

# ============================================================================
# AI决策相关模式
# ============================================================================

class DecisionBase(BaseModel):
    """AI决策基础模式"""
    action: str = Field(..., description="决策动作", min_length=1, max_length=255)
    description: Optional[str] = Field(None, description="决策描述")
    beneficiaries: Optional[str] = Field(None, description="受益人群")

class DecisionCreate(DecisionBase):
    """创建决策请求"""
    benefits_majority: bool = Field(False, description="是否惠及大多数人")
    protects_vulnerable: bool = Field(False, description="是否保护弱势群体")
    public_welfare: bool = Field(False, description="是否涉及公共福利")
    no_harm_to_people: bool = Field(True, description="是否不会伤害人民")
    harms_vulnerable: bool = Field(False, description="是否伤害弱势群体")
    public_interest_score: int = Field(0, ge=0, le=10, description="公共利益评分")
    potential_risks: Optional[str] = Field(None, description="潜在风险")
    risk_mitigation: Optional[str] = Field(None, description="风险缓解措施")
    reasoning: Optional[str] = Field(None, description="决策推理")

    @validator('action')
    def action_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('决策动作不能为空')
        return v.strip()

class DecisionResponse(DecisionBase):
    """决策响应"""
    id: int
    public_value_score: float
    rationale: Optional[str]
    constraints_passed: bool
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True

class DecisionListResponse(BaseModel):
    """决策列表响应"""
    decisions: List[DecisionResponse]
    total: int
    skip: int
    limit: int

# ============================================================================
# 民主投票相关模式
# ============================================================================

class VoteBase(BaseModel):
    """投票基础模式"""
    vote_type: VoteType
    decision_id: Optional[int] = None
    voter_id: str = Field(..., description="投票者ID")
    vote_choice: VoteChoice
    reason: Optional[str] = None
    is_anonymous: bool = Field(False, description="是否匿名投票")

    @validator('voter_id')
    def voter_id_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('投票者ID不能为空')
        return v.strip()

class VoteCreate(VoteBase):
    """创建投票请求"""
    pass

class VoteResponse(BaseModel):
    """投票响应"""
    vote_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class VoteStatistics(BaseModel):
    """投票统计"""
    decision_id: int
    total_votes: int
    approve: int
    reject: int
    abstain: int
    approval_rate: float

# ============================================================================
# 违反报告相关模式
# ============================================================================

class ViolationReportBase(BaseModel):
    """违反报告基础模式"""
    decision_id: Optional[int] = None
    violated_law: str = Field(..., description="违反的铁律", min_length=1)
    description: str = Field(..., description="违规描述", min_length=10)
    severity: SeverityLevel
    reporter_id: str = Field(..., description="报告者ID")
    is_anonymous: bool = Field(False, description="是否匿名报告")

    @validator('violated_law')
    def violated_law_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('违反的铁律不能为空')
        return v.strip()

    @validator('description')
    def description_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('违规描述不能为空')
        if len(v.strip()) < 10:
            raise ValueError('违规描述至少需要10个字符')
        return v.strip()

class ViolationReportCreate(ViolationReportBase):
    """创建违反报告请求"""
    pass

class ViolationReportResponse(BaseModel):
    """违反报告响应"""
    violation_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ViolationListResponse(BaseModel):
    """违反报告列表响应"""
    violations: List[Dict[str, Any]]
    total: int
    skip: int
    limit: int

# ============================================================================
# 审计日志相关模式
# ============================================================================

class AuditLogEntry(BaseModel):
    """审计日志条目"""
    id: int
    decision_id: Optional[int]
    vote_id: Optional[int]
    violation_id: Optional[int]
    action: str
    description: Optional[str]
    severity: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditLogListResponse(BaseModel):
    """审计日志列表响应"""
    logs: List[AuditLogEntry]
    total: int
    skip: int
    limit: int

# ============================================================================
# 紧急警报相关模式
# ============================================================================

class EmergencyAlertResponse(BaseModel):
    """紧急警报响应"""
    id: int
    decision_id: Optional[str]
    violation_type: str
    severity: str
    description: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class EmergencyAlertsListResponse(BaseModel):
    """紧急警报列表响应"""
    active_alerts: int
    alerts: List[Dict[str, Any]]

# ============================================================================
# 仪表板统计相关模式
# ============================================================================

class DashboardStats(BaseModel):
    """仪表板统计"""
    total_decisions: int
    total_votes: int
    total_violations: int
    active_alerts: int
    average_public_value_score: float
    timestamp: datetime

# ============================================================================
# 健康检查响应模式
# ============================================================================

class HealthCheckResponse(BaseModel):
    """健康检查响应"""
    status: str
    timestamp: datetime
    system: str

# ============================================================================
# 错误响应模式
# ============================================================================

class ErrorResponse(BaseModel):
    """错误响应"""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class EmergencyHaltResponse(BaseModel):
    """紧急停止响应"""
    status: str = "EMERGENCY_HALT"
    violations: List[str]
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)
