import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Badge } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  BugOutlined,
  AlertOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import './App.css';
import Dashboard from './pages/Dashboard';
import Decisions from './pages/Decisions';
import VotingSystem from './pages/VotingSystem';
import ViolationReports from './pages/ViolationReports';
import EmergencyAlerts from './pages/EmergencyAlerts';
import { getEmergencyAlerts } from './api/client';

const { Header, Sider, Content } = Layout;

// 内部布局组件，包含路由逻辑
const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [emergencyAlerts, setEmergencyAlerts] = useState(0);

  // 获取当前选中的菜单key
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.substring(1); // 去掉开头的 /
  };

  // 监听紧急警报
  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const data = await getEmergencyAlerts();
        setEmergencyAlerts(data.active_alerts || 0);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: 'decisions',
      icon: <FileTextOutlined />,
      label: 'AI决策',
    },
    {
      key: 'voting',
      icon: <TeamOutlined />,
      label: '民主投票',
    },
    {
      key: 'violations',
      icon: <BugOutlined />,
      label: '违反报告',
    },
    {
      key: 'alerts',
      icon: <AlertOutlined />,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>紧急警报</span>
          {emergencyAlerts > 0 && <Badge count={emergencyAlerts} style={{ backgroundColor: '#ff4d4f' }} />}
        </div>
      ),
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(`/${key === 'dashboard' ? '' : key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            众生智枢 · 全民民主监督平台
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} theme="dark" breakpoint="lg" collapsedWidth={0}>
          <div style={{ padding: '16px', color: 'white', textAlign: 'center', fontSize: '12px' }}>
            为民服务 · 全民监督
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <Content style={{ padding: '24px', background: '#f0f2f5' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/decisions" element={<Decisions />} />
              <Route path="/voting" element={<VotingSystem />} />
              <Route path="/violations" element={<ViolationReports />} />
              <Route path="/alerts" element={<EmergencyAlerts />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

// App根组件
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
