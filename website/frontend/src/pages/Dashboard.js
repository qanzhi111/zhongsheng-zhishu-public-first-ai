import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, List, Tag, Timeline, Divider, Typography, Space, Button } from 'antd';
import { 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  FileProtectOutlined, 
  AlertTriangleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { getDashboardStats, getDecisions } from '../api/client';
import './Dashboard.css';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_decisions: 0,
    total_votes: 0,
    total_violations: 0,
    active_alerts: 0,
    average_public_value_score: 0
  });
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, decisionsData] = await Promise.all([
        getDashboardStats(),
        getDecisions(0, 10)
      ]);
      
      setStats(statsData);
      setRecentDecisions(decisionsData.decisions || []);
      setLoading(false);
    } catch (err) {
      console.error('获取仪表板数据失败:', err);
      setError(err.message || '获取数据失败，请检查网络连接或后端服务是否正常');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#1890ff';
    if (score >= 40) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '需改进';
  };

  const lineChartData = recentDecisions.map((d, index) => ({
    index: index + 1,
    score: d.public_value_score || 0
  }));

  const lineConfig = {
    data: lineChartData,
    xField: 'index',
    yField: 'score',
    label: { position: 'top' },
    color: '#1890ff',
    point: { size: 5, shape: 'diamond' },
    scale: { y: { min: 0, max: 100 } }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>
              <SafetyCertificateOutlined style={{ color: '#1890ff', marginRight: 10 }} />
              众生智枢 · 全民民主监督平台
            </Title>
            <Paragraph type="secondary">
              实时监控AI决策 · 全民民主监督 · 透明可审计
            </Paragraph>
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchDashboardData}
            loading={loading}
          >
            刷新数据
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message="数据加载失败"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" onClick={fetchDashboardData}>
              重试
            </Button>
          }
        />
      )}

      {stats.active_alerts > 0 && (
        <Alert
          message="紧急警报"
          description={`当前有 ${stats.active_alerts} 个活跃的紧急警报需要处理。系统正在密切监控中。`}
          type="error"
          showIcon
          icon={<AlertTriangleOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="stat-card">
            <Statistic
              title="总决策数"
              value={stats.total_decisions}
              prefix={<FileProtectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="stat-card">
            <Statistic
              title="民主投票数"
              value={stats.total_votes}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="stat-card">
            <Statistic
              title="违规报告数"
              value={stats.total_violations}
              prefix={<AlertTriangleOutlined />}
              valueStyle={{ color: stats.total_violations > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="stat-card">
            <Statistic
              title="活跃警报"
              value={stats.active_alerts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: stats.active_alerts > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title="公共价值评分趋势" 
            extra={<Tag icon={<CheckCircleOutlined />} color="success">实时监控</Tag>}
          >
            <div style={{ height: 300 }}>
              {lineChartData.length > 0 ? (
                <Line {...lineConfig} />
              ) : (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                  暂无数据
                </div>
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="系统健康状态"
            extra={<Tag color="blue">综合评分: {getScoreLabel(stats.average_public_value_score)}</Tag>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>平均公共价值评分</Text>
                <Progress 
                  percent={stats.average_public_value_score} 
                  status="active"
                  strokeColor={getScoreColor(stats.average_public_value_score)}
                  format={(p) => `${p.toFixed(1)}/100`}
                />
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div className="health-status">
                <Row gutter={16}>
                  <Col span={12}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>约束系统</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Tag color="success">活跃</Tag>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 12 }}>
                  <Col span={12}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>监督系统</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Tag color="success">启用</Tag>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 12 }}>
                  <Col span={12}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>透明度</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Tag color="success">100%</Tag>
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card 
            title="最近决策" 
            extra={
              <a href="#/decisions" style={{ color: '#1890ff' }}>
                查看全部 →
              </a>
            }
          >
            <List
              loading={loading}
              dataSource={recentDecisions}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tag color={item.constraints_passed ? 'success' : 'error'}>
                      {item.constraints_passed ? '通过' : '拒绝'}
                    </Tag>
                  ]}
                >
                  <List.Item.Meta
                    title={item.action}
                    description={item.description || '无描述'}
                  />
                  <div style={{ minWidth: 120 }}>
                    <Progress 
                      percent={item.public_value_score || 0} 
                      size="small"
                      strokeColor={getScoreColor(item.public_value_score || 0)}
                      format={(p) => `${p}%`}
                    />
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无决策记录' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="核心价值观" className="values-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="value-item">
                  <Title level={4}>为人民服务</Title>
                  <Text type="secondary">所有AI的终极目标，优先考虑最广大人民的利益</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="value-item">
                  <Title level={4}>众生平等</Title>
                  <Text type="secondary">无差别地服务所有人，禁止任何形式的歧视</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="value-item">
                  <Title level={4}>永不为恶</Title>
                  <Text type="secondary">绝对禁止伤害人类，保护弱势群体</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="value-item">
                  <Title level={4}>透明可监督</Title>
                  <Text type="secondary">所有决策公开透明，接受全民民主监督</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '40px 0 20px' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          智枢为民，众生平等；AI为公，永不异化。
        </Text>
      </Divider>
    </div>
  );
};

export default Dashboard;
