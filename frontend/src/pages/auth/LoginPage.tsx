import Page from '@/components/HOC/page';
import { routeConfig } from '@/config/routeConfig';
import { authService } from '@/utils/authService';
import { Button, Form, Input, message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login schema
const loginSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormData) => {
    try {
      // Validate form data
      loginSchema.parse(values);

      // Send login request
      const response = await authService.login(values);

      // Store tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      message.success('Login successful!');
      navigate(routeConfig.dashboard.path());
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        error.errors.forEach((err) => {
          message.error(err.message);
        });
      } else if (error instanceof Error) {
        // Handle API errors
        message.error(error.message || 'Login failed');
      } else {
        message.error('An unexpected error occurred');
      }
    }
  };

  return (
    <Page>
      <div className="text-center">
        <Typography.Title level={3} className="text-gray-900 m-0">
          Welcome Back
        </Typography.Title>
        <Typography.Paragraph>Please enter your credentials to sign in</Typography.Paragraph>
      </div>

      <Form form={form} name="login" onFinish={onFinish} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { pattern: emailRegex, message: 'Please enter a valid email address' },
          ]}
        >
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full mt-2">
            Sign In
          </Button>
        </Form.Item>

        <div className="text-center">
          <Typography.Text>
            Don't have an account?{' '}
            <Typography.Link href={routeConfig.register.path()}>Register</Typography.Link>
          </Typography.Text>
        </div>
      </Form>
    </Page>
  );
};

export default LoginPage;
