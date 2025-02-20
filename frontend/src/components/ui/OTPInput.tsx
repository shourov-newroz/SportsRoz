import React from 'react';
import ReactOTPInput from 'react-otp-input';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  error = false,
  disabled = false,
  length = 6,
}) => {
  return (
    <ReactOTPInput
      value={value}
      onChange={onChange}
      numInputs={length}
      renderInput={(props) => (
        <input
          {...props}
          style={{
            ...props.style,
            width: '3rem',
            height: '3rem',
            margin: '0 0.5rem',
            fontSize: '1.25rem',
            borderRadius: '4px',
            border: error ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
            textAlign: 'center',
          }}
          disabled={disabled}
        />
      )}
      shouldAutoFocus
      containerStyle="justify-center"
      inputType="tel"
    />
  );
};

export default OTPInput;
