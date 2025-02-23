import { Card } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[450px] max-sm:px-4">
        <Card className="py-12 px-4 md:px-16 shadow-lg sm:rounded-lg space-y-4">
          <div className="flex justify-center items-center">
            <img src="/logo/full_logo.svg" alt="logo" className="h-10 w-auto" />
          </div>
          <Outlet />
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
