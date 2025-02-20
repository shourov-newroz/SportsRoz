import Page from '@/components/HOC/page';
import { Typography } from 'antd';
import React from 'react';
import RegistrationForm from '../../components/auth/RegistrationForm';

const RegisterPage: React.FC = () => {
  return (
    <Page>
      <div className="text-center">
        <Typography.Title level={3} className="text-gray-900 m-0">
          Welcome Back
        </Typography.Title>
        <Typography.Paragraph>Please enter your credentials to sign in</Typography.Paragraph>
      </div>
      <RegistrationForm />
    </Page>
  );
};

export default RegisterPage;
