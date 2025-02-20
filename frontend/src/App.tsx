import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, ThemeConfig } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import ErrorBoundary from './components/ErrorBoundary';
import { swrConfig } from './config/swrConfig';
import { darkTheme, lightTheme } from './config/theme';
import { AuthProvider } from './contexts/auth/authContextProvider';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';

const AppContent = () => {
  const { algorithm, isDark } = useTheme();

  const themeConfig: ThemeConfig = {
    token: {
      colorPrimary: isDark ? darkTheme['--primary-color'] : lightTheme['--primary-color'],
      colorBgContainer: isDark
        ? darkTheme['--background-color-light']
        : lightTheme['--background-color-light'],
      colorText: isDark ? darkTheme['--text-color'] : lightTheme['--text-color'],
      colorTextSecondary: isDark
        ? darkTheme['--text-color-secondary']
        : lightTheme['--text-color-secondary'],
      colorBorder: isDark ? darkTheme['--border-color'] : lightTheme['--border-color'],
      borderRadius: 4,
      fontFamily: lightTheme['--font-family'],
    },
  };

  return (
    <ConfigProvider
      componentSize="large"
      theme={{
        algorithm,
        ...themeConfig,
      }}
    >
      <StyleProvider hashPriority="low">
        <SWRConfig value={swrConfig}>
          <HelmetProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </HelmetProvider>
        </SWRConfig>
      </StyleProvider>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
