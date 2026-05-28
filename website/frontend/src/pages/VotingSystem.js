import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, message, Divider, Alert } from 'antd';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  PlusOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import './VotingSystem.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const VotingSystem = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/decisions');
      const data = await response.json();
      
      if (data.decisions && data.decisions.length > 0) {
        const firstDecisionId = data.decisions[0].id;
        const statsResponse = await fetch(`http://localhost:8000/api/votes/statistics/${firstDecisionId}`);
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }
    } catch (error) {
      console.error('获取投票数据失败:', error);
    }
    setLoading(false);
  };

  const handleCreateVote = async (values) => {
    try {
      const response = await fetch('http://localhost:8000/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          decision_id: values.decision_id || 1,
          voter_id: values.voter_id || `voter_${Date.now()}`,
          vote_choice: values.vote_choice,
          is_anonymous: values.is_anonymous || false
        }),
      });

      if (response.ok) {
        message.success('投票成功！');
        setModalVisible(false);
        form.resetFields();
        fetchVotes();
      } else {
        message.error('投票失败，请重试');
      }
    } catch (error) {
      message.error('提交投票时出错');
      console.error(error);
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
        <Title level={2}>
          <TeamOutlined style={{ color: '#722ed1', marginRight: 10 }} />
          民主投票系统
        </Title>
        <Paragraph type="secondary">
          全民参与AI治理 · 民主决策 · 公开透明
        </Paragraph>
      </div>

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
        <Button 
          icon={<BarChartOutlined />}
          onClick={fetchVotes}
          size="large"
        >
          刷新统计
        </Button>
      </div>

      <Card title="投票统计" style={{ marginBottom: 24 }}>
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
