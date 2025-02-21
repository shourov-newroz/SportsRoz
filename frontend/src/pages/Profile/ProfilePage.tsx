import BACKEND_ENDPOINTS from '@/api/endpoints';
import { sendPutRequest } from '@/config/swrConfig';
import useAuth from '@/hooks/useAuth';
import { IApiResponse } from '@/types/common';
import { Gender, IUser } from '@/types/user.types';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  message,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import useSWRMutation from 'swr/mutation';

interface ProfileFormData {
  name: string;
  jerseyName?: string;
  sportType?: string[];
  dateOfBirth?: Date;
  gender?: Gender;
  contactNumber?: string;
}

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = useForm<ProfileFormData>();

  const profileUrl = authUser?.id ? BACKEND_ENDPOINTS.USERS.GET_PROFILE(authUser.id) : null;
  const { data, isLoading, error } = useSWR<IApiResponse<IUser>>(profileUrl);

  const handleEdit = () => {
    if (!data?.data) return;
    form.setFieldsValue({
      ...data.data,
      dateOfBirth: data.data.dateOfBirth ? dayjs(data.data.dateOfBirth) : undefined,
      sportType: data.data.sportType || [],
    });
    setIsEditModalVisible(true);
  };

  const { trigger: updateProfile } = useSWRMutation(
    authUser?.id ? BACKEND_ENDPOINTS.USERS.UPDATE_PROFILE(authUser.id) : null,
    sendPutRequest
  );

  const handleSubmit = async (values: ProfileFormData) => {
    try {
      if (!authUser?.id) return;

      // Make the API call
      await updateProfile({
        ...values,
        dateOfBirth: values.dateOfBirth?.toISOString(),
      });

      // Close modal and show success message
      setIsEditModalVisible(false);
      message.success('Profile updated successfully');

      // Revalidate the data
      globalMutate(profileUrl);
    } catch (error) {
      // Revert the optimistic update on error
      globalMutate(profileUrl);

      if (error instanceof Error) {
        message.error(error.message || 'Failed to update profile');
      } else {
        message.error('Failed to update profile');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading profile: {error.message}</div>;
  }

  if (!data) {
    return <div className="text-center">No profile data available</div>;
  }

  const user = data.data;

  return (
    <div className="p-6">
      <Card
        title="Profile Information"
        className="max-w-3xl mx-auto"
        extra={
          <Button type="primary" onClick={handleEdit}>
            Edit Profile
          </Button>
        }
      >
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

      <Modal
        title="Edit Profile"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            ...user,
            dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="jerseyName" label="Jersey Name">
            <Input />
          </Form.Item>

          <Form.Item name="sportType" label="Sport Types">
            <Select mode="multiple" placeholder="Select sports">
              <Select.Option value="Dart">Dart</Select.Option>
              <Select.Option value="Table Tennis">Table Tennis</Select.Option>
              <Select.Option value="FIFA">FIFA</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Date of Birth">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="contactNumber" label="Contact Number">
            <Input />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button type="default" onClick={() => setIsEditModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
