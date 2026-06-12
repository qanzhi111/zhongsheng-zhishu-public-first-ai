/**
 * 统一API客户端
 * 读取环境变量 REACT_APP_API_URL，封装所有API调用
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * 统一的错误处理函数
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `请求失败 (${response.status})`;
    
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      // 如果无法解析错误响应，使用默认消息
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  
  try {
    return await response.json();
  } catch (e) {
    return response.text();
  }
};

/**
 * GET请求
 */
const get = async (endpoint, params = {}) => {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse(response);
};

/**
 * POST请求
 */
const post = async (endpoint, data = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

// ============================================================================
// API 方法
// ============================================================================

/**
 * 健康检查
 */
export const healthCheck = async () => {
  return get('/health');
};

/**
 * 获取仪表板统计数据
 */
export const getDashboardStats = async () => {
  return get('/api/dashboard-stats');
};

/**
 * 获取决策列表
 */
export const getDecisions = async (skip = 0, limit = 20) => {
  return get('/api/decisions', { skip, limit });
};

/**
 * 获取单个决策详情
 */
export const getDecision = async (decisionId) => {
  return get(`/api/decisions/${decisionId}`);
};

/**
 * 创建新决策
 */
export const createDecision = async (data) => {
  return post('/api/decisions', data);
};

/**
 * 获取投票统计（按决策ID）
 */
export const getVoteStatistics = async (decisionId) => {
  return get(`/api/votes/statistics/${decisionId}`);
};

/**
 * 获取所有决策的投票概览（修复：不再只看第一条决策）
 */
export const getVotesOverview = async () => {
  return get('/api/votes/overview');
};

/**
 * 创建投票
 */
export const createVote = async (data) => {
  return post('/api/votes', data);
};

/**
 * 获取违规报告列表
 */
export const getViolations = async (skip = 0, limit = 20) => {
  return get('/api/violations', { skip, limit });
};

/**
 * 创建违规报告
 */
export const createViolation = async (data) => {
  return post('/api/violations', data);
};

/**
 * 获取紧急警报列表
 */
export const getEmergencyAlerts = async () => {
  return get('/api/emergency-alerts');
};

/**
 * 解决紧急警报
 */
export const resolveAlert = async (alertId) => {
  return post(`/api/emergency-alerts/${alertId}/resolve`);
};

/**
 * 获取审计日志
 */
export const getAuditLogs = async (skip = 0, limit = 50) => {
  return get('/api/audit-logs', { skip, limit });
};

// 导出API_BASE常量供其他模块使用
export { API_BASE };
