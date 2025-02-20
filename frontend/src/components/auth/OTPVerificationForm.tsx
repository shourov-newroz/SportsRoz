import BACKEND_ENDPOINTS from '@/api/endpoints';
import { routeConfig } from '@/config/routeConfig';
import { sendPostRequest } from '@/config/swrConfig';
import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';

// OTP verification schema
const otpVerificationSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;

interface OTPVerificationFormProps {
  token: string;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ token }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.AUTH.VERIFY_OTP,
    sendPostRequest
  );

  const onFinish = async (values: OTPVerificationFormData) => {
    try {
      // Validate form data with Zod
      otpVerificationSchema.parse(values);

      // Transform data to match API expectations
      const verificationData = {
        token,
        otp: values.otp,
      };

      // Call verification API
      await trigger(verificationData);

      message.success('Email verified successfully!');
      navigate(routeConfig.login.path());
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
          message.error('Verification failed. Please try again.');
        }
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Form form={form} name="otpVerification" onFinish={onFinish} layout="vertical">
      <Form.Item
        name="otp"
        label="Verification Code"
        rules={[
          { required: true, message: 'Please input the verification code!' },
          { len: 6, message: 'Verification code must be 6 digits!' },
          { pattern: /^\d+$/, message: 'Verification code must be numeric!' },
        ]}
      >
        <Input prefix={<LockOutlined />} maxLength={6} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isMutating} className="w-full mt-2">
          Verify Email
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OTPVerificationForm;
