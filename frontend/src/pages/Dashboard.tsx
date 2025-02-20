import { Button, Card, Space, Typography } from 'antd';
import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/loading/LoadingSpinner';

const { Title, Paragraph } = Typography;

const StyleTest = lazy(() => import('../components/StyleTest'));
const ThemeTest = lazy(() => import('../components/ThemeTest'));

const Dashboard = () => {
  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto mb-8">
        <Space direction="vertical" size="large" className="w-full">
          <Title level={2}>Welcome to SportsRoz</Title>
          <Paragraph>
            This is a sample page demonstrating the integration of Ant Design components. The
            layout, typography, buttons, and cards are all from Ant Design's component library.
          </Paragraph>
          <Space>
            <Button type="primary">Get Started</Button>
            <Button>Learn More</Button>
          </Space>
        </Space>
      </Card>

      <Suspense fallback={<LoadingSpinner />}>
        <StyleTest />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ThemeTest />
      </Suspense>
    </div>
  );
};

export default Dashboard;
