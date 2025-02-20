import { Alert } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4">
          <Alert
            message="Something went wrong"
            description={
              <div>
                <p>We apologize for the inconvenience. Please try refreshing the page.</p>
                <details className="mt-2">
                  <summary>Error details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded">{this.state.error?.message}</pre>
                </details>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
