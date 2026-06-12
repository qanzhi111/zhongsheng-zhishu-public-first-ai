import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Typography, Descriptions, Modal, Collapse, Badge, Alert } from 'antd';
import { 
  FileProtectOutlined, 
  EyeOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { getDecisions, getDecision } from '../api/client';
import './Decisions.css';

const { Title, Text, Paragraph } = Typography;

const Decisions = () => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDecisions();
  }, [pagination.current, pagination.pageSize]);

  const fetchDecisions = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDecisions((page - 1) * pagination.pageSize, pagination.pageSize);
      setDecisions(data.decisions || []);
      setPagination(prev => ({ ...prev, total: data.total, current: page }));
    } catch (err) {
      console.error('获取决策列表失败:', err);
      setError(err.message || '获取数据失败');
    }
    setLoading(false);
  };

  const handleViewDetails = async (decision) => {
    try {
      const data = await getDecision(decision.id);
      setSelectedDecision(data);
      setModalVisible(true);
    } catch (err) {
      console.error('获取决策详情失败:', err);
      setError(err.message || '获取详情失败');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '决策动作',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Space>
          <FileProtectOutlined style={{ color: '#1890ff' }} />
          <Text strong>{action}</Text>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => desc || <Text type="secondary">无描述</Text>,
    },
    {
      title: '公共价值评分',
      dataIndex: 'public_value_score',
      key: 'public_value_score',
      width: 150,
      render: (score) => (
        <Tag color={getScoreColor(score)}>
          {(score || 0).toFixed(1)}/100
        </Tag>
      ),
      sorter: (a, b) => (a.public_value_score || 0) - (b.public_value_score || 0),
    },
    {
      title: '约束状态',
      dataIndex: 'constraints_passed',
      key: 'constraints_passed',
      width: 120,
      render: (passed) => (
        <Tag color={passed ? 'success' : 'error'} icon={passed ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}>
          {passed ? '通过' : '违反'}
        </Tag>
      ),
      filters: [
        { text: '通过', value: true },
        { text: '违反', value: false },
      ],
      onFilter: (value, record) => record.constraints_passed === value,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-',
      sorter: (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    if (newPagination.current) {
      fetchDecisions(newPagination.current);
    }
  };

  // 用于Collapse的items属性（新API）
  const collapseItems = [
    {
      key: 'rationale',
      label: '决策理由',
      children: (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: 12, 
          borderRadius: 4,
          whiteSpace: 'pre-wrap',
          fontSize: 12
        }}>
          {selectedDecision?.rationale || '暂无理由说明'}
        </pre>
      ),
    },
  ];

  return (
    <div className="decisions-container">
      <div className="decisions-header">
        <Title level={2}>
          <FileProtectOutlined style={{ color: '#1890ff', marginRight: 10 }} />
          AI决策列表
        </Title>
        <Paragraph type="secondary">
          所有AI决策均经过为民价值评估和约束检查，完全透明可审计
        </Paragraph>
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

      <Card>
        <Table
          columns={columns}
          dataSource={decisions}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="受益人群">{record.beneficiaries || '未知'}</Descriptions.Item>
                  <Descriptions.Item label="公共价值评分">
                    <Badge status={getScoreColor(record.public_value_score) === 'green' ? 'success' : 'processing'} />
                    {(record.public_value_score || 0).toFixed(1)}/100
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title="决策详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedDecision && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="决策ID" span={1}>{selectedDecision.id}</Descriptions.Item>
              <Descriptions.Item label="约束状态" span={1}>
                <Tag color={selectedDecision.constraints_passed ? 'success' : 'error'}>
                  {selectedDecision.constraints_passed ? '通过' : '违反'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="决策动作" span={2}>
                <Text strong>{selectedDecision.action}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="决策描述" span={2}>
                {selectedDecision.description || '无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="受益人群" span={2}>
                {selectedDecision.beneficiaries || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="公共价值评分" span={2}>
                <Tag color={getScoreColor(selectedDecision.public_value_score)}>
                  {(selectedDecision.public_value_score || 0).toFixed(1)}/100
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {selectedDecision.created_at ? new Date(selectedDecision.created_at).toLocaleString('zh-CN') : '-'}
              </Descriptions.Item>
            </Descriptions>

            <Collapse style={{ marginTop: 16 }} items={collapseItems} />
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

export default Decisions;
