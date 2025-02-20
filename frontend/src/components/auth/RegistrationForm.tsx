import BACKEND_ENDPOINTS from '@/api/endpoints';
import { routeConfig } from '@/config/routeConfig';
import { sendPostRequest } from '@/config/swrConfig';
import { IdcardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Registration schema
const registrationSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    passwordConfirmation: z.string(),
    fullName: z.string().min(1, 'Full name is required'),
    officeId: z.string().min(1, 'Office ID is required'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation(BACKEND_ENDPOINTS.AUTH.REGISTER, sendPostRequest);

  const onFinish = async (values: RegistrationFormData) => {
    try {
      // Validate form data with Zod
      registrationSchema.parse(values);

      // Transform data to match API expectations
      const registrationData = {
        full_name: values.fullName,
        email: values.email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        office_id: values.officeId,
      };

      // Call registration API
      await trigger(registrationData);

      message.success('Registration successful! Please wait for admin approval.');
      navigate(routeConfig.login.path());
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          message.error(err.message);
        });
      } else if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Form form={form} name="register" onFinish={onFinish} layout="vertical" scrollToFirstError>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            pattern: passwordRegex,
            message:
              'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        name="passwordConfirmation"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[{ required: true, message: 'Please input your full name!' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>

      <Form.Item
        name="officeId"
        label="Office ID"
        rules={[{ required: true, message: 'Please input your office ID!' }]}
      >
        <Input prefix={<IdcardOutlined />} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isMutating} className="w-full mt-2">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
