import Page from '@/components/HOC/page';
import React from 'react';

const Unauthorized: React.FC = () => {
  return (
    <Page>
      <div>
        <h1 className='text-3xl font-bold text-red-600'>Unauthorized Access</h1>
      </div>
    </Page>
  );
};

export default Unauthorized;
