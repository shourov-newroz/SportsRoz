import Page from '@/components/HOC/page';
import React from 'react';
import RegistrationForm from '../../components/auth/RegistrationForm';

const RegisterPage: React.FC = () => {
  return (
    <Page>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Join SportsRoz to participate in tournaments and track your progress
        </p>
      </div>
      <RegistrationForm />
    </Page>
  );
};

export default RegisterPage;
