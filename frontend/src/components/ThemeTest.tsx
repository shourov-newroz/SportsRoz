import { Card, Divider, Space, Typography } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text } = Typography;

const ThemeTest = () => {
  const { isDark } = useTheme();

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <Title level={3} className="text-heading">
        Theme Variables Test
      </Title>

      <Space direction="vertical" size="large" className="w-full">
        {/* Colors */}
        <section>
          <Title level={4}>Colors</Title>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="bg-primary p-4 text-white">Primary Color</div>
              <div className="bg-success p-4 text-white">Success Color</div>
              <div className="bg-warning p-4 text-white">Warning Color</div>
              <div className="bg-error p-4 text-white">Error Color</div>
            </div>
            <div className="space-y-2">
              <div className="bg-light p-4 text-text">Light Background</div>
              <div className="bg-base p-4 text-text">Base Background</div>
              <div className="bg-dark p-4 text-white">Dark Background</div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Typography */}
        <section>
          <Title level={4}>Typography</Title>
          <div className="space-y-4">
            <Text className="text-text block">Default Text Color</Text>
            <Text className="text-text-secondary block">Secondary Text Color</Text>
            <Text className="text-heading block">Heading Text Color</Text>
            <Text className="text-disabled block">Disabled Text Color</Text>
          </div>
        </section>

        <Divider />

        {/* Components */}
        <section>
          <Title level={4}>Component Styles</Title>
          <div className="space-y-4">
            <div className="bg-card p-4 border border-border rounded-base">
              Card Background with Border
            </div>
            <div className="bg-menu p-4">Menu Background</div>
            <div className="bg-menu-active p-4">Active Menu Item Background</div>
          </div>
        </section>

        <Divider />

        {/* Spacing */}
        <section>
          <Title level={4}>Spacing</Title>
          <div className="space-y-4">
            <div className="bg-primary p-lg text-white">Padding Large</div>
            <div className="bg-primary p-md text-white">Padding Medium</div>
            <div className="bg-primary p-sm text-white">Padding Small</div>
            <div className="bg-primary p-xs text-white">Padding Extra Small</div>
          </div>
        </section>

        {/* Current Theme */}
        <div className="mt-8 text-center">
          <Text className="text-lg">
            Current Theme: <span className="font-bold">{isDark ? 'Dark' : 'Light'}</span>
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default ThemeTest;
