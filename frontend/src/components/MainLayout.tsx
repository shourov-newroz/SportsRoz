import { Layout } from 'antd';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingSpinner from './loading/LoadingSpinner';
import MainNav from './navigation/MainNav';

const { Content, Footer } = Layout;

const MainLayout = () => {
  // const location = useLocation();
  // const { isDark, toggleTheme } = useTheme();

  return (
    <Layout className="min-h-screen">
      <MainNav />
      <Content>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </Content>
      <Footer className="text-center">
        SportsRoz ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};

export default MainLayout;
