import BACKEND_ENDPOINTS from '@/api/endpoints';
import { OTP_STORAGE_KEYS } from '@/config/config';
import { routeConfig } from '@/config/routeConfig';
import { sendPostRequest } from '@/config/swrConfig';
import { OTPResponse } from '@/lib/validations/auth';
import { IApiResponse } from '@/types/common';
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
    confirmPassword: z.string(),
    fullName: z.string().min(1, 'Full name is required'),
    officeId: z.string().min(1, 'Office ID is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    OTP_TOKEN_KEY,
    OTP_EXPIRY_KEY,
    OTP_INTERVAL_KEY,
    OTP_EXPIRY_TIMESTAMP_KEY,
    OTP_INTERVAL_TIMESTAMP_KEY,
  } = OTP_STORAGE_KEYS;

  const { trigger, isMutating } = useSWRMutation(BACKEND_ENDPOINTS.AUTH.REGISTER, sendPostRequest, {
    onSuccess: (response: IApiResponse<OTPResponse>) => {
      const { token, expiryTime, intervalTime } = response.data;
      // Store token, expiry and interval times for OTP verification
      sessionStorage.setItem(OTP_TOKEN_KEY, token);
      sessionStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());
      sessionStorage.setItem(OTP_INTERVAL_KEY, intervalTime.toString());
      const timestamp = Date.now() + expiryTime * 1000;
      sessionStorage.setItem(OTP_EXPIRY_TIMESTAMP_KEY, timestamp.toString());

      const intervalTimestamp = sessionStorage.getItem(OTP_INTERVAL_TIMESTAMP_KEY);
      if (!intervalTimestamp) {
        const timestamp = Date.now() + intervalTime * 1000;
        sessionStorage.setItem(OTP_INTERVAL_TIMESTAMP_KEY, timestamp.toString());
      }

      // Navigate to login page
      navigate(routeConfig.login.path());
    },
  });

  const onFinish = async (values: RegistrationFormData) => {
    try {
      // Validate form data with Zod
      registrationSchema.parse(values);

      // Transform data to match API expectations
      const registrationData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        officeId: values.officeId,
      };

      trigger(registrationData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          message.error(err.message);
        });
      } else if (axios.isAxiosError(error)) {
        // Handle backend validation errors
        if (error.response?.data?.errors) {
          // Set form field errors
          const backendErrors = error.response.data.errors;
          const formErrors: { [key: string]: { errors: string[] } } = {};

          Object.entries(backendErrors).forEach(([field, message]) => {
            formErrors[field] = {
              errors: [message as string],
            };
          });

          form.setFields(
            Object.entries(formErrors).map(([field, error]) => ({
              name: field,
              errors: error.errors,
            }))
          );
        } else {
          message.error('Registration failed. Please try again.');
        }
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
        name="confirmPassword"
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
