import BACKEND_ENDPOINTS from '@/api/endpoints';
import { sendPostRequest } from '@/config/swrConfig';
import useAuth from '@/hooks/useAuth';
import { IApiResponse } from '@/types/common';
import { CreateRoleData, IRole } from '@/types/role.types';
import { Button, Card, Form, Input, Modal, Space, Table, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const { Title } = Typography;

const RolesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm<CreateRoleData>();

  // Redirect if not admin
  // React.useEffect(() => {
  //   if (user && user.role !== 'admin') {
  //     navigate('/unauthorized');
  //   }
  // }, [user, navigate]);

  // Fetch roles
  const {
    data: rolesData,
    isLoading,
    mutate,
  } = useSWR<IApiResponse<IRole[]>>(BACKEND_ENDPOINTS.ROLES.GET_ALL);

  // Create role mutation
  const { trigger: createRole, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.ROLES.CREATE,
    sendPostRequest
  );

  const handleCreateRole = async (values: CreateRoleData) => {
    try {
      await createRole(values);
      message.success('Role created successfully');
      setIsCreateModalVisible(false);
      form.resetFields();
      mutate(); // Refresh roles list
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to create role');
      } else {
        message.error('Failed to create role');
      }
    }
  };

  const columns: ColumnsType<IRole> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Role Management</Title>
          <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
            Create Role
          </Button>
        </div>

        <Table columns={columns} dataSource={rolesData?.data} loading={isLoading} rowKey="id" />

        <Modal
          title="Create Role"
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateRole}>
            <Form.Item
              name="name"
              label="Role Name"
              rules={[
                { required: true, message: 'Please enter role name' },
                { min: 2, message: 'Role name must be at least 2 characters' },
                {
                  pattern: /^[a-zA-Z0-9_-]+$/,
                  message: 'Role name can only contain letters, numbers, hyphens and underscores',
                },
              ]}
            >
              <Input placeholder="Enter role name" />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setIsCreateModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={isMutating}>
                  Create
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default RolesPage;
