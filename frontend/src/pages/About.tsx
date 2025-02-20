import { Card, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <Space direction="vertical" size="large" className="w-full">
          <Title level={2}>About Us</Title>
          <Paragraph>
            SportsRoz is your ultimate destination for sports content and community engagement. We
            bring together sports enthusiasts from around the world to share their passion for the
            games they love.
          </Paragraph>
          <Paragraph>
            Our platform is built with modern web technologies including React, TypeScript, Ant
            Design, and Tailwind CSS to provide the best possible user experience.
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default About;
