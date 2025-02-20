import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  startTime?: number;
  onExpire?: () => void;
  initText?: string;
  restart?: boolean;
  isTimestamp?: boolean;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  startTime,
  onExpire,
  initText = '',
  restart = false,
  isTimestamp = false,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (isTimestamp && startTime) {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((startTime - now) / 1000));
      return diff;
    }
    return initialSeconds;
  });

  useEffect(() => {
    if (restart) {
      if (isTimestamp && startTime) {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((startTime - now) / 1000));
        setTimeLeft(diff);
      } else {
        setTimeLeft(initialSeconds);
      }
    }
  }, [restart, initialSeconds, startTime, isTimestamp]);

  useEffect(() => {
    if (timeLeft === 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      if (isTimestamp && startTime) {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((startTime - now) / 1000));
        setTimeLeft(diff);
      } else {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire, startTime, isTimestamp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      {initText}{' '}
      <span className="font-medium">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer;
