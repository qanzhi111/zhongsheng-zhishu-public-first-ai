import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, message, Divider, Alert } from 'antd';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  PlusOutlined,
  BarChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import { getDecisions, getVotesOverview, getVoteStatistics, createVote } from '../api/client';
import './VotingSystem.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const VotingSystem = () => {
  const [decisions, setDecisions] = useState([]);
  const [votesOverview, setVotesOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDecisionId, setSelectedDecisionId] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 获取决策列表
      const decisionsData = await getDecisions(0, 100);
      setDecisions(decisionsData.decisions || []);
      
      // 获取所有决策的投票概览（修复：不再只看第一条决策）
      const overviewData = await getVotesOverview();
      setVotesOverview(overviewData);
      
      // 默认选择第一个决策的统计
      if (overviewData?.decisions?.length > 0) {
        setSelectedDecisionId(overviewData.decisions[0].decision_id);
        setStatistics(overviewData.decisions[0]);
      }
    } catch (err) {
      console.error('获取投票数据失败:', err);
      setError(err.message || '获取数据失败');
    }
    setLoading(false);
  };

  const handleDecisionChange = (decisionId) => {
    setSelectedDecisionId(decisionId);
    const decisionStats = votesOverview?.decisions?.find(d => d.decision_id === decisionId);
    if (decisionStats) {
      setStatistics(decisionStats);
    }
  };

  const handleCreateVote = async (values) => {
    try {
      const voteData = {
        vote_type: values.vote_type,
        decision_id: values.decision_id ? parseInt(values.decision_id, 10) : null,
        voter_id: values.voter_id || `voter_${Date.now()}`,
        vote_choice: values.vote_choice,
        reason: values.reason,
        is_anonymous: values.is_anonymous || false
      };
      
      await createVote(voteData);
      message.success('投票成功！');
      setModalVisible(false);
      form.resetFields();
      fetchData(); // 刷新数据
    } catch (err) {
      console.error('提交投票失败:', err);
      message.error(err.message || '投票失败，请重试');
    }
  };

  const voteTypeMap = {
    'EMERGENCY_VETO': { color: 'red', text: '紧急否决' },
    'DECISION_REVIEW': { color: 'blue', text: '决策审查' },
    'SANCTION_VOTE': { color: 'orange', text: '制裁投票' },
    'POLICY_CHANGE': { color: 'purple', text: '政策变更' }
  };

  const choiceTypeMap = {
    'approve': { color: 'green', text: '赞成', icon: <CheckCircleOutlined /> },
    'reject': { color: 'red', text: '反对', icon: <CloseCircleOutlined /> },
    'abstain': { color: 'default', text: '弃权', icon: null }
  };

  const pieData = statistics ? [
    { type: '赞成', value: statistics.approve || 0 },
    { type: '反对', value: statistics.reject || 0 },
    { type: '弃权', value: statistics.abstain || 0 },
  ] : [];

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{percentage}',
    },
    legend: {
      position: 'bottom',
    },
    color: ['#52c41a', '#ff4d4f', '#d9d9d9'],
  };

  return (
    <div className="voting-container">
      <div className="voting-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>
              <TeamOutlined style={{ color: '#722ed1', marginRight: 10 }} />
              民主投票系统
            </Title>
            <Paragraph type="secondary">
              全民参与AI治理 · 民主决策 · 公开透明
            </Paragraph>
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
            loading={loading}
          >
            刷新
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Alert
        message="民主参与"
        description="所有重大AI决策都需要经过全民投票。您的每一票都代表着人民的声音，共同维护AI为全体人民服务的宗旨。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          size="large"
        >
          创建投票
        </Button>
      </div>

      <Card title="投票统计" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong>选择决策查看投票详情：</Text>
          <Select
            style={{ width: 300, marginLeft: 8 }}
            placeholder="请选择决策"
            value={selectedDecisionId}
            onChange={handleDecisionChange}
            loading={loading}
          >
            {decisions.map(decision => (
              <Option key={decision.id} value={decision.id}>
                #{decision.id} - {decision.action.substring(0, 30)}{decision.action.length > 30 ? '...' : ''}
              </Option>
            ))}
          </Select>
        </div>
        
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', minWidth: 300 }}>
            {statistics ? (
              <>
                <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">总票数</Text>
                    <Title level={2}>{statistics.total_votes || 0}</Title>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">赞成率</Text>
                    <Title level={2} style={{ color: '#52c41a' }}>
                      {(statistics.approval_rate || 0).toFixed(1)}%
                    </Title>
                  </div>
                </Space>
                <Divider />
                <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                  <Tag color="green" style={{ fontSize: 16, padding: '8px 16px' }}>
                    赞成: {statistics.approve || 0}
                  </Tag>
                  <Tag color="red" style={{ fontSize: 16, padding: '8px 16px' }}>
                    反对: {statistics.reject || 0}
                  </Tag>
                  <Tag color="default" style={{ fontSize: 16, padding: '8px 16px' }}>
                    弃权: {statistics.abstain || 0}
                  </Tag>
                </Space>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                暂无投票数据
              </div>
            )}
          </div>
          <div style={{ flex: '1 1 400px', minWidth: 300, height: 300 }}>
            {pieData.length > 0 && pieData.some(d => d.value > 0) ? (
              <Pie {...pieConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                暂无数据
              </div>
            )}
          </div>
        </div>
      </Card>

      {votesOverview && votesOverview.decisions && votesOverview.decisions.length > 0 && (
        <Card title="所有决策投票概览" style={{ marginBottom: 24 }}>
          <Table
            dataSource={votesOverview.decisions}
            rowKey="decision_id"
            pagination={false}
            columns={[
              {
                title: '决策ID',
                dataIndex: 'decision_id',
                key: 'decision_id',
                width: 100,
              },
              {
                title: '决策名称',
                dataIndex: 'decision_action',
                key: 'decision_action',
                ellipsis: true,
              },
              {
                title: '总票数',
                dataIndex: 'total_votes',
                key: 'total_votes',
                width: 100,
              },
              {
                title: '赞成',
                dataIndex: 'approve',
                key: 'approve',
                width: 80,
                render: (val) => <Tag color="green">{val}</Tag>,
              },
              {
                title: '反对',
                dataIndex: 'reject',
                key: 'reject',
                width: 80,
                render: (val) => <Tag color="red">{val}</Tag>,
              },
              {
                title: '弃权',
                dataIndex: 'abstain',
                key: 'abstain',
                width: 80,
                render: (val) => <Tag color="default">{val}</Tag>,
              },
              {
                title: '赞成率',
                dataIndex: 'approval_rate',
                key: 'approval_rate',
                width: 100,
                render: (val) => `${(val || 0).toFixed(1)}%`,
              },
            ]}
          />
        </Card>
      )}

      <Card title="投票类型说明">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <Card size="small">
            <Tag color={voteTypeMap['EMERGENCY_VETO'].color}>
              {voteTypeMap['EMERGENCY_VETO'].text}
            </Tag>
            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
              对违反铁律的AI决策进行紧急否决
            </Paragraph>
          </Card>
          <Card size="small">
            <Tag color={voteTypeMap['DECISION_REVIEW'].color}>
              {voteTypeMap['DECISION_REVIEW'].text}
            </Tag>
            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
              对AI决策进行民主审查和评估
            </Paragraph>
          </Card>
          <Card size="small">
            <Tag color={voteTypeMap['SANCTION_VOTE'].color}>
              {voteTypeMap['SANCTION_VOTE'].text}
            </Tag>
            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
              决定对违规AI的制裁措施
            </Paragraph>
          </Card>
          <Card size="small">
            <Tag color={voteTypeMap['POLICY_CHANGE'].color}>
              {voteTypeMap['POLICY_CHANGE'].text}
            </Tag>
            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
              提议或修改AI治理政策
            </Paragraph>
          </Card>
        </div>
      </Card>

      <Modal
        title="创建投票"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateVote}
          initialValues={{
            vote_type: 'DECISION_REVIEW',
            vote_choice: 'approve',
            is_anonymous: false
          }}
        >
          <Form.Item
            label="关联决策"
            name="decision_id"
            tooltip="选择要投票的AI决策（可选）"
          >
            <Select allowClear placeholder="请选择决策（可选）">
              {decisions.map(decision => (
                <Option key={decision.id} value={decision.id}>
                  #{decision.id} - {decision.action.substring(0, 40)}{decision.action.length > 40 ? '...' : ''}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="投票类型"
            name="vote_type"
            rules={[{ required: true, message: '请选择投票类型' }]}
          >
            <Select>
              <Option value="EMERGENCY_VETO">
                <Tag color={voteTypeMap['EMERGENCY_VETO'].color}>
                  {voteTypeMap['EMERGENCY_VETO'].text}
                </Tag>
              </Option>
              <Option value="DECISION_REVIEW">
                <Tag color={voteTypeMap['DECISION_REVIEW'].color}>
                  {voteTypeMap['DECISION_REVIEW'].text}
                </Tag>
              </Option>
              <Option value="SANCTION_VOTE">
                <Tag color={voteTypeMap['SANCTION_VOTE'].color}>
                  {voteTypeMap['SANCTION_VOTE'].text}
                </Tag>
              </Option>
              <Option value="POLICY_CHANGE">
                <Tag color={voteTypeMap['POLICY_CHANGE'].color}>
                  {voteTypeMap['POLICY_CHANGE'].text}
                </Tag>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="投票选择"
            name="vote_choice"
            rules={[{ required: true, message: '请选择您的投票' }]}
          >
            <Select>
              <Option value="approve">
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  赞成
                </Space>
              </Option>
              <Option value="reject">
                <Space>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  反对
                </Space>
              </Option>
              <Option value="abstain">
                <Space>
                  <TeamOutlined />
                  弃权
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="投票理由"
            name="reason"
          >
            <TextArea 
              rows={4} 
              placeholder="请说明您的投票理由（可选）"
            />
          </Form.Item>

          <Form.Item
            label="匿名投票"
            name="is_anonymous"
            valuePropName="checked"
          >
            <Space>
              <span>匿名投票可以保护您的隐私</span>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交投票
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Divider style={{ margin: '40px 0 20px' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          智枢为民，众生平等；AI为公，永不异化。
        </Text>
      </Divider>
    </div>
  );
};

export default VotingSystem;
