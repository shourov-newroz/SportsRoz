import BACKEND_ENDPOINTS from '@/api/endpoints';
import Page from '@/components/HOC/page';
import CountdownTimer from '@/components/ui/CountdownTimer';
import OTPInput from '@/components/ui/OTPInput';
import { routeConfig } from '@/config/routeConfig';
import { sendPostRequest } from '@/config/swrConfig';
import {
  OTPResponse,
  ResendOTPPayload,
  VerifyOTPPayload,
  VerifyOTPResponse,
  verifyOTPSchema,
} from '@/lib/validations/auth';
import { LoadingOutlined } from '@ant-design/icons';
import { Form, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

const OTP_STORAGE_KEYS = {
  OTP_TOKEN_KEY: 'otp_token',
  OTP_EXPIRY_KEY: 'otp_expiry',
  OTP_INTERVAL_KEY: 'otp_interval',
  OTP_EXPIRY_TIMESTAMP_KEY: 'otp_expiry_timestamp',
  OTP_INTERVAL_TIMESTAMP_KEY: 'otp_interval_timestamp',
};

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const {
    OTP_TOKEN_KEY,
    OTP_EXPIRY_KEY,
    OTP_INTERVAL_KEY,
    OTP_EXPIRY_TIMESTAMP_KEY,
    OTP_INTERVAL_TIMESTAMP_KEY,
  } = OTP_STORAGE_KEYS;

  const [expiryTime, setExpiryTime] = useState<number>(() => {
    const stored = sessionStorage.getItem(OTP_EXPIRY_KEY);
    return stored ? parseInt(stored) : 300;
  });

  const [intervalTime, setIntervalTime] = useState<number>(() => {
    const stored = sessionStorage.getItem(OTP_INTERVAL_KEY);
    return stored ? parseInt(stored) : 60;
  });

  const [restartTimer, setRestartTimer] = useState({
    expiry: false,
    interval: false,
  });

  // Set initial expiry timestamp if not set
  useEffect(() => {
    const token = sessionStorage.getItem(OTP_TOKEN_KEY);
    const expiryTime = parseInt(sessionStorage.getItem(OTP_EXPIRY_KEY) || '0');
    const intervalTime = parseInt(sessionStorage.getItem(OTP_INTERVAL_KEY) || '0');

    if (!token || !expiryTime || !intervalTime) {
      navigate(routeConfig.register.path());
      return;
    }

    const expiryTimestamp = sessionStorage.getItem(OTP_EXPIRY_TIMESTAMP_KEY);
    if (!expiryTimestamp) {
      const timestamp = Date.now() + expiryTime * 1000;
      sessionStorage.setItem(OTP_EXPIRY_TIMESTAMP_KEY, timestamp.toString());
      sessionStorage.setItem(OTP_TOKEN_KEY, token);
      sessionStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());
      sessionStorage.setItem(OTP_INTERVAL_KEY, intervalTime.toString());
    }
  }, [navigate, OTP_EXPIRY_TIMESTAMP_KEY, OTP_TOKEN_KEY, OTP_EXPIRY_KEY, OTP_INTERVAL_KEY]);

  const clearOTPData = () => {
    sessionStorage.removeItem(OTP_TOKEN_KEY);
    sessionStorage.removeItem(OTP_EXPIRY_KEY);
    sessionStorage.removeItem(OTP_INTERVAL_KEY);
    sessionStorage.removeItem(OTP_EXPIRY_TIMESTAMP_KEY);
    sessionStorage.removeItem(OTP_INTERVAL_TIMESTAMP_KEY);
  };

  const { trigger: verifyOTP, isMutating: isSubmitting } = useSWRMutation<
    VerifyOTPResponse,
    Error,
    string,
    VerifyOTPPayload
  >(BACKEND_ENDPOINTS.AUTH.VERIFY_OTP, sendPostRequest, {
    onSuccess: () => {
      message.success('OTP verified successfully');
      clearOTPData();
      // Navigate to reset password with verified state
      navigate(routeConfig.resetPassword.path());
    },
  });

  const { trigger: resendOTP } = useSWRMutation<OTPResponse, Error, string, ResendOTPPayload>(
    BACKEND_ENDPOINTS.AUTH.RESEND_OTP,
    sendPostRequest,
    {
      onSuccess: (response: OTPResponse) => {
        const { token, expiryTime: newExpiryTime, intervalTime: newIntervalTime } = response;

        // Update token and timers in session storage
        sessionStorage.setItem(OTP_TOKEN_KEY, token);
        sessionStorage.setItem(OTP_EXPIRY_KEY, newExpiryTime.toString());
        sessionStorage.setItem(OTP_INTERVAL_KEY, newIntervalTime.toString());

        // Set new expiry timestamp
        const expiryTimestamp = Date.now() + newExpiryTime * 1000;
        sessionStorage.setItem(OTP_EXPIRY_TIMESTAMP_KEY, expiryTimestamp.toString());

        // Set new interval timestamp
        const intervalTimestamp = Date.now() + newIntervalTime * 1000;
        sessionStorage.setItem(OTP_INTERVAL_TIMESTAMP_KEY, intervalTimestamp.toString());

        // Update state
        setExpiryTime(newExpiryTime);
        setIntervalTime(newIntervalTime);
        setCanResend(false);

        // Trigger timer restart
        setRestartTimer({
          expiry: true,
          interval: true,
        });

        // Reset isCodeExpired to false
        setIsCodeExpired(false);

        message.success(`A new OTP has been sent to your email`);
      },
    }
  );

  const handleResendOTP = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      await resendOTP({ email: '' });
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPChange = (value: string) => {
    form.setFieldsValue({ otp: value });
    // Only validate if we have all digits
    if (value.length === 6) {
      form.validateFields(['otp']).catch(() => {});
    }
  };

  const onFinish = async (values: { otp: string }) => {
    try {
      // Validate OTP format
      verifyOTPSchema.parse({ otp: values.otp });

      const token = sessionStorage.getItem(OTP_TOKEN_KEY);
      if (!token) {
        message.error('Invalid session. Please try again.');
        navigate(routeConfig.register.path());
        return;
      }

      await verifyOTP({ token: token, otp: values.otp });
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('An unexpected error occurred');
      }
    }
  };

  return (
    <Page>
      <div className="flex flex-col space-y-8 w-full max-w-md">
        <div className="text-center">
          <Typography.Title level={3} className="text-gray-900 m-0">
            Verify Your Email
          </Typography.Title>
          <Typography.Paragraph>
            Please enter the verification code sent to your email address.
          </Typography.Paragraph>
        </div>

        <CountdownTimer
          initialSeconds={expiryTime}
          startTime={parseInt(
            sessionStorage.getItem(OTP_EXPIRY_TIMESTAMP_KEY) ||
              (Date.now() + expiryTime * 1000).toString()
          )}
          onExpire={() => {
            setCanResend(true);
            setIsCodeExpired(true);
            sessionStorage.removeItem(OTP_EXPIRY_TIMESTAMP_KEY);
            setRestartTimer((prev) => ({ ...prev, expiry: false }));
          }}
          initText="Code expires in:"
          restart={restartTimer.expiry}
          isTimestamp
          className="justify-center"
        />

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="otp"
            className="mb-6"
            rules={[
              { required: true, message: 'Please enter the verification code' },
              { len: 6, message: 'Verification code must be 6 digits' },
              { pattern: /^\d+$/, message: 'Verification code must be numeric' },
            ]}
          >
            <OTPInput
              value={form.getFieldValue('otp') || ''}
              onChange={handleOTPChange}
              error={!!form.getFieldError('otp')}
              disabled={isSubmitting || isCodeExpired}
            />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white font-semibold rounded-lg disabled:opacity-50"
              disabled={isSubmitting || isCodeExpired}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <LoadingOutlined className="mr-2" />
                  Verifying...
                </span>
              ) : isCodeExpired ? (
                'Code Expired'
              ) : (
                'Verify Email'
              )}
            </button>
          </Form.Item>

          <div className="text-center mt-4">
            {canResend ? (
              <button
                type="button"
                className="text-primary hover:text-primary-dark"
                disabled={!canResend || isResending}
                onClick={handleResendOTP}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <LoadingOutlined className="mr-2" />
                    Resending...
                  </span>
                ) : (
                  'Resend Code'
                )}
              </button>
            ) : (
              <CountdownTimer
                initialSeconds={intervalTime}
                startTime={parseInt(
                  sessionStorage.getItem(OTP_INTERVAL_TIMESTAMP_KEY) ||
                    (
                      Date.now() +
                      parseInt(sessionStorage.getItem(OTP_INTERVAL_KEY) || '0') * 1000
                    ).toString()
                )}
                onExpire={() => {
                  setCanResend(true);
                  sessionStorage.removeItem(OTP_INTERVAL_TIMESTAMP_KEY);
                  setRestartTimer((prev) => ({ ...prev, interval: false }));
                }}
                initText="Resend code in:"
                restart={restartTimer.interval}
                isTimestamp
              />
            )}
          </div>
        </Form>
      </div>
    </Page>
  );
};

export default OTPVerificationPage;
