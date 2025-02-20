import Page from '@/components/HOC/page';
import { routeConfig } from '@/config/routeConfig';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Page title='404'>
      <div className='min-h-[80vh] flex items-center justify-center bg-white text-green-600'>
        <div className='text-center'>
          <h1 className='text-6xl font-bold text-indigo-600'>404</h1>
          <h2 className='mt-4 text-3xl font-bold text-gray-900'>
            Page Not Found
          </h2>
          <p className='mt-4 text-lg text-gray-600'>
            Sorry, the page you are looking for does not exist.
          </p>
          <div className='mt-8'>
            <Link
              to={routeConfig.dashboard.path()}
              className='inline-flex items-center px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700'
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default NotFound;
