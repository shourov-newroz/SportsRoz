import BACKEND_ENDPOINTS from '@/api/endpoints';
import useAuth from '@/hooks/useAuth';
import { IApiResponse } from '@/types/common';
import { IUser } from '@/types/user.types';
import { Card, Descriptions, Spin } from 'antd';
import React from 'react';
import useSWR from 'swr';

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const { data, isLoading } = useSWR<IApiResponse<IUser>>(
    authUser?.id ? BACKEND_ENDPOINTS.USERS.GET_PROFILE(authUser.id) : null
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>Error loading profile</div>;
  }

  const user = data.data;
  console.log(user);

  return (
    <div className="p-6">
      <Card title="Profile Information" className="max-w-3xl mx-auto">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Office ID">{user.officeId}</Descriptions.Item>
          {user.jerseyName && (
            <Descriptions.Item label="Jersey Name">{user.jerseyName}</Descriptions.Item>
          )}
          {user.sportType && user.sportType.length > 0 && (
            <Descriptions.Item label="Sport Types">{user.sportType.join(', ')}</Descriptions.Item>
          )}
          {user.dateOfBirth && (
            <Descriptions.Item label="Date of Birth">
              {new Date(user.dateOfBirth).toLocaleDateString()}
            </Descriptions.Item>
          )}
          {user.gender && <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>}
          {user.contactNumber && (
            <Descriptions.Item label="Contact Number">{user.contactNumber}</Descriptions.Item>
          )}
        </Descriptions>
        {user.profilePicture && (
          <div className="mt-4">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
