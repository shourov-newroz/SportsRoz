import { useTheme } from '@/contexts/ThemeContext';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <nav className="bg-background-light border-b border-border transition-colors duration-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Title level={3} className="flex items-center gap-2">
              LOGO
            </Title>
            <div className="flex items-center gap-2">
              <Button onClick={toggleTheme}>{isDark ? <SunOutlined /> : <MoonOutlined />}</Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="duration-300 transition-[padding]">
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
