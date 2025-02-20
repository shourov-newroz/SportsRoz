import { Button, Card, Input, Space, Typography } from 'antd';

const { Title, Text } = Typography;

const StyleTest = () => {
  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={3} className="text-blue-600 font-bold mb-8">
            Typography Test
          </Title>
          <Text className="text-lg text-gray-700 block mb-2">
            This text uses Tailwind classes for size and color
          </Text>
          <Text className="font-semibold text-green-600 hover:text-green-800">
            Hover over this text to see color transition
          </Text>
        </div>

        <div>
          <Title level={4} className="text-purple-600 mb-4">
            Button Tests
          </Title>
          <Space className="flex flex-wrap gap-4">
            <Button type="primary" className="hover:opacity-80 transition-opacity">
              Primary Button
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:opacity-90">
              Gradient Button
            </Button>
            <Button type="default" className="shadow-lg hover:shadow-xl transition-shadow">
              Shadow Button
            </Button>
          </Space>
        </div>

        <div>
          <Title level={4} className="text-indigo-600 mb-4">
            Input Tests
          </Title>
          <Space direction="vertical" className="w-full">
            <Input
              placeholder="Default Input"
              className="hover:border-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Custom Styled Input"
              className="rounded-lg border-2 border-purple-300 hover:border-purple-500 focus:border-purple-500"
            />
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default StyleTest;
