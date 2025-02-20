import { routeConfig } from '@/config/routeConfig';
import useAuth from '@/hooks/useAuth';
import { Button, Layout, Menu, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const MainNav: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
      navigate(routeConfig.login.path());
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to logout');
      } else {
        message.error('Failed to logout');
      }
    }
  };

  return (
    <Header className="flex justify-between items-center bg-white border-b">
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-8">SportsRoz</h1>
        <Menu mode="horizontal" className="border-none">
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="cricket">Cricket</Menu.Item>
          <Menu.Item key="news">News</Menu.Item>
          {user && <Menu.Item key="profile">Profile</Menu.Item>}
        </Menu>
      </div>
      <div>
        {user ? (
          <Button onClick={handleLogout} type="link">
            Logout
          </Button>
        ) : (
          <div className="space-x-4">
            <Button type="link" onClick={() => navigate(routeConfig.login.path())}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate(routeConfig.register.path())}>
              Register
            </Button>
          </div>
        )}
      </div>
    </Header>
  );
};

export default MainNav;
