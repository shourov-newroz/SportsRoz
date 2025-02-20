import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        tip="Loading..."
        size="large"
      />
    </div>
  );
};

export default LoadingSpinner;
