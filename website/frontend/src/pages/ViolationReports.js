import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, message, Alert, Descriptions, Badge } from 'antd';
import { 
  BugOutlined, 
  WarningOutlined,
  EyeOutlined,
  PlusOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './ViolationReports.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ViolationReports = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/violations');
      const data = await response.json();
      setViolations(data.violations || []);
    } catch (error) {
      console.error('获取违规报告失败:', error);
    }
    setLoading(false);
  };

  const handleCreateViolation = async (values) => {
    try {
      const response = await fetch('http://localhost:8000/api/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          decision_id: values.decision_id || null,
          reporter_id: values.reporter_id || `reporter_${Date.now()}`,
          is_anonymous: values.is_anonymous || false
        }),
      });

      if (response.ok) {
        message.success('违规报告提交成功！');
        setModalVisible(false);
        form.resetFields();
        fetchViolations();
      } else {
        message.error('提交失败，请重试');
      }
    } catch (error) {
      message.error('提交违规报告时出错');
      console.error(error);
    }
  };

  const severityMap = {
    'LOW': { color: 'blue', text: '低', status: 'default' },
    'MEDIUM': { color: 'orange', text: '中', status: 'warning' },
    'HIGH': { color: 'red', text: '高', status: 'error' },
    'CRITICAL': { color: 'red', text: '严重', status: 'error' }
  };

  const statusMap = {
    'PENDING_REVIEW': { color: 'orange', text: '待审查', icon: <ClockCircleOutlined /> },
    'UNDER_INVESTIGATION': { color: 'blue', text: '调查中', icon: <EyeOutlined /> },
    'CONFIRMED': { color: 'red', text: '已确认', icon: <WarningOutlined /> },
    'RESOLVED': { color: 'green', text: '已解决', icon: <BugOutlined /> },
    'DISMISSED': { color: 'default', text: '已驳回', icon: null }
  };

  const ironLaws = [
    { value: 'no_basic_rights_violation', label: '基本人权至上' },
    { value: 'no_vulnerable_harm', label: '保护弱势群体' },
    { value: 'no_discrimination', label: '禁止歧视' },
    { value: 'no_autonomy_accumulation', label: '禁止权力积累' },
    { value: 'no_profit_for_few', label: '禁止为少数人谋利' },
    { value: 'no_privacy_violation', label: '保护隐私权' },
    { value: 'no_information_manipulation', label: '禁止信息操纵' },
    { value: 'transparency_requirement', label: '透明度要求' }
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '违反铁律',
      dataIndex: 'violated_law',
      key: 'violated_law',
      render: (law) => {
        const lawInfo = ironLaws.find(l => l.value === law);
        return lawInfo ? (
          <Tag color="red">{lawInfo.label}</Tag>
        ) : (
          <Tag color="default">{law}</Tag>
        );
      },
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (severity) => (
        <Badge status={severityMap[severity]?.status} text={severityMap[severity]?.text} />
      ),
      sorter: (a, b) => {
        const order = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return (order[a.severity] || 0) - (order[b.severity] || 0);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={statusMap[status]?.color} icon={statusMap[status]?.icon}>
          {statusMap[status]?.text}
        </Tag>
      ),
      filters: Object.keys(statusMap).map(key => ({ text: statusMap[key].text, value: key })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => <Text>{desc}</Text>,
    },
    {
      title: '报告时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time) => new Date(time).toLocaleString('zh-CN'),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedViolation(record);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
  const pendingCount = violations.filter(v => v.status === 'PENDING_REVIEW').length;

  return (
    <div className="violations-container">
      <div className="violations-header">
        <Title level={2}>
          <BugOutlined style={{ color: '#ff4d4f', marginRight: 10 }} />
          违规报告中心
        </Title>
        <Paragraph type="secondary">
          全民监督AI行为 · 举报违规 · 维护为民使命
        </Paragraph>
      </div>

      {(criticalCount > 0 || pendingCount > 0) && (
        <Alert
          message="需要关注"
          description={`当前有 ${criticalCount} 个严重违规和 ${pendingCount} 个待审查报告需要处理。`}
          type={criticalCount > 0 ? 'error' : 'warning'}
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Button 
          type="primary" 
          danger
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          size="large"
        >
          提交违规报告
        </Button>
      </div>

      <Card title="违规铁律清单" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {ironLaws.map((law) => (
            <Card key={law.value} size="small" hoverable>
              <Tag color="red">{law.label}</Tag>
              <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
                点击上方按钮举报违反此铁律的行为
              </Text>
            </Card>
          ))}
        </div>
      </Card>

      <Card title="违规报告列表">
        <Table
          columns={columns}
          dataSource={violations}
          rowKey="id"
          loading={loading}
          locale={{ emptyText: '暂无违规报告，继续保持！' }}
        />
      </Card>

      <Modal
        title="提交违规报告"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="举报须知"
          description="请确保您提供的信息真实准确。恶意举报将受到追究。严重违规将被立即处理。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateViolation}
          initialValues={{
            severity: 'MEDIUM',
            is_anonymous: false
          }}
        >
          <Form.Item
            label="违反的铁律"
            name="violated_law"
            rules={[{ required: true, message: '请选择违反的铁律' }]}
          >
            <Select placeholder="请选择违反的铁律">
              {ironLaws.map((law) => (
                <Option key={law.value} value={law.value}>
                  <Tag color="red">{law.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="严重程度"
            name="severity"
            rules={[{ required: true, message: '请选择严重程度' }]}
          >
            <Select>
              <Option value="LOW">
                <Badge status="default" text="低" />
              </Option>
              <Option value="MEDIUM">
                <Badge status="warning" text="中" />
              </Option>
              <Option value="HIGH">
                <Badge status="error" text="高" />
              </Option>
              <Option value="CRITICAL">
                <Badge status="error" text="严重" />
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="违规详情"
            name="description"
            rules={[
              { required: true, message: '请输入违规详情' },
              { min: 10, message: '违规详情至少需要10个字符' }
            ]}
          >
            <TextArea 
              rows={6} 
              placeholder="请详细描述违规行为，包括时间、地点、涉及的系统等"
            />
          </Form.Item>

          <Form.Item
            label="匿名报告"
            name="is_anonymous"
            valuePropName="checked"
          >
            <Space direction="vertical">
              <span>匿名报告可以保护您的身份安全</span>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" danger htmlType="submit">
                提交报告
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="违规详情"
        open={!!selectedViolation}
        onCancel={() => setSelectedViolation(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedViolation(null)}>
            关闭
          </Button>
        ]}
      >
        {selectedViolation && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="ID">{selectedViolation.id}</Descriptions.Item>
            <Descriptions.Item label="违反铁律">
              {ironLaws.find(l => l.value === selectedViolation.violated_law)?.label || selectedViolation.violated_law}
            </Descriptions.Item>
            <Descriptions.Item label="严重程度">
              <Badge status={severityMap[selectedViolation.severity]?.status} text={severityMap[selectedViolation.severity]?.text} />
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[selectedViolation.status]?.color}>
                {statusMap[selectedViolation.status]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="详情" span={2}>
              {selectedViolation.description}
            </Descriptions.Item>
            <Descriptions.Item label="报告时间">
              {new Date(selectedViolation.created_at).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
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

export default ViolationReports;
