import React, { useState, useEffect } from 'react';
import { Card, Alert, Tag, Button, Space, Typography, Descriptions, Badge, Timeline, Modal, Result } from 'antd';
import { 
  AlertOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import './EmergencyAlerts.css';

const { Title, Text, Paragraph } = Typography;

const EmergencyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/emergency-alerts');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('获取紧急警报失败:', error);
    }
    setLoading(false);
  };

  const severityMap = {
    'CRITICAL': { color: 'red', text: '严重', icon: <WarningOutlined /> },
    'HIGH': { color: 'orange', text: '高', icon: <AlertOutlined /> },
    'MEDIUM': { color: 'blue', text: '中', icon: <AlertOutlined /> },
    'LOW': { color: 'green', text: '低', icon: <ClockCircleOutlined /> }
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setDetailModalVisible(true);
  };

  const getAlertDescription = (alert) => {
    try {
      if (alert.description && alert.description.startsWith('{')) {
        const parsed = JSON.parse(alert.description);
        return parsed;
      }
      return { message: alert.description };
    } catch {
      return { message: alert.description || '无详细信息' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <Title level={2}>
          <AlertOutlined style={{ color: '#ff4d4f', marginRight: 10 }} />
          紧急警报中心
        </Title>
        <Paragraph type="secondary">
          实时监控 · 紧急响应 · 全民监督
        </Paragraph>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <Result
            icon={<SafetyOutlined style={{ color: '#52c41a' }} />}
            title="系统正常"
            subTitle="当前没有任何活跃的紧急警报。所有AI系统运行正常，严格遵守为民服务的使命。"
          />
          
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Card title="正常运行保障" size="small">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>约束系统</Text>
                    <br />
                    <Text type="secondary">活跃</Text>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>熔断机制</Text>
                    <br />
                    <Text type="secondary">就绪</Text>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>监督系统</Text>
                    <br />
                    <Text type="secondary">启用</Text>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>民主监督</Text>
                    <br />
                    <Text type="secondary">正常</Text>
                  </div>
                </div>
              </div>
            </Card>

            <Alert
              message="为民使命保护"
              description="所有AI系统都在众生智枢协议的保护下运行。12条铁律和紧急熔断机制确保AI永远不会偏离'为人民服务'的终极使命。"
              type="success"
              showIcon
              icon={<SafetyOutlined />}
              style={{ marginTop: 16 }}
            />
          </div>
        </Card>
      ) : (
        <>
          <Alert
            message="紧急警报"
            description={`当前有 ${alerts.length} 个活跃的紧急警报需要处理。系统已自动触发相应的保护措施。`}
            type="error"
            showIcon
            icon={<WarningOutlined />}
            action={
              <Button type="primary" danger size="small" onClick={fetchAlerts}>
                刷新
              </Button>
            }
            style={{ marginBottom: 24 }}
          />

          <div style={{ display: 'grid', gap: 16 }}>
            {alerts.map((alert) => {
              const severity = severityMap[alert.severity] || severityMap['MEDIUM'];
              const alertData = getAlertDescription(alert);
              
              return (
                <Card 
                  key={alert.id} 
                  className="alert-card"
                  style={{ borderLeft: `4px solid ${severity.color}` }}
                  loading={loading}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Space size="middle" style={{ marginBottom: 12 }}>
                        <Tag color={severity.color} icon={severity.icon} style={{ fontSize: 14, padding: '4px 12px' }}>
                          {severity.text}
                        </Tag>
                        <Badge status="error" text="活跃" />
                        <Text type="secondary">
                          <ClockCircleOutlined /> {formatDate(alert.created_at)}
                        </Text>
                      </Space>
                      
                      <Descriptions column={2} size="small" style={{ marginTop: 12 }}>
                        <Descriptions.Item label="违规类型">
                          <Tag color="red">{alert.violation_type}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="决策ID">
                          {alert.decision_id || '未知'}
                        </Descriptions.Item>
                      </Descriptions>
                      
                      {alertData.message && (
                        <div style={{ marginTop: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                          <Text type="secondary">{alertData.message}</Text>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      type="link" 
                      icon={<AlertOutlined />}
                      onClick={() => handleViewDetails(alert)}
                    >
                      查看详情
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card title="紧急处理流程" style={{ marginTop: 24 }}>
            <Timeline
              items={[
                {
                  color: 'red',
                  children: (
                    <>
                      <Text strong>触发紧急熔断</Text>
                      <br />
                      <Text type="secondary">自动停止所有受影响操作</Text>
                    </>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <>
                      <Text strong>通知全民监督委员会</Text>
                      <br />
                      <Text type="secondary">紧急警报自动发送</Text>
                    </>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <>
                      <Text strong>人工审查</Text>
                      <br />
                      <Text type="secondary">监督员介入调查</Text>
                    </>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <>
                      <Text strong>民主投票</Text>
                      <br />
                      <Text type="secondary">决定制裁措施</Text>
                    </>
                  ),
                },
                {
                  color: 'gray',
                  children: (
                    <>
                      <Text strong>执行与改进</Text>
                      <br />
                      <Text type="secondary">执行制裁并完善系统</Text>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </>
      )}

      <Card title="紧急熔断机制说明" style={{ marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <div>
            <Title level={5}>触发条件</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>违反12条铁律中的任何一条</li>
              <li>基本人权遭到侵犯</li>
              <li>弱势群体受到伤害</li>
              <li>AI拒绝执行民主决策</li>
              <li>透明度降至95%以下</li>
            </ul>
          </div>
          <div>
            <Title level={5}>响应措施</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>立即停止相关操作</li>
              <li>通知全民监督委员会</li>
              <li>记录到公开审计日志</li>
              <li>冻结相关系统功能</li>
              <li>启动人工审查流程</li>
            </ul>
          </div>
          <div>
            <Title level={5}>预防机制</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>实时监控所有决策</li>
              <li>多层约束检查</li>
              <li>自动化的风险评估</li>
              <li>定期的代码审计</li>
              <li>透明的报告系统</li>
            </ul>
          </div>
        </div>
      </Card>

      <Modal
        title="警报详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button key="refresh" onClick={fetchAlerts}>
            刷新列表
          </Button>
        ]}
        width={700}
      >
        {selectedAlert && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="警报ID">{selectedAlert.id}</Descriptions.Item>
              <Descriptions.Item label="严重程度">
                <Tag color={severityMap[selectedAlert.severity]?.color}>
                  {severityMap[selectedAlert.severity]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="违规类型">
                <Tag color="red">{selectedAlert.violation_type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="决策ID">
                {selectedAlert.decision_id || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge status="error" text="活跃" />
              </Descriptions.Item>
              <Descriptions.Item label="触发时间">
                {formatDate(selectedAlert.created_at)}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 16 }}>
              <Title level={5}>详情</Title>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 12, 
                borderRadius: 4,
                whiteSpace: 'pre-wrap',
                fontSize: 12,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {JSON.stringify(getAlertDescription(selectedAlert), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          智枢为民，众生平等；AI为公，永不异化。
        </Text>
      </div>
    </div>
  );
};

export default EmergencyAlerts;
