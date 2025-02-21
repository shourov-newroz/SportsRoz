import BACKEND_ENDPOINTS from '@/api/endpoints';
import { sendPostRequest } from '@/config/swrConfig';
import useAuth from '@/hooks/useAuth';
import { IApiResponse } from '@/types/common';
import { IPermission } from '@/types/permission.types';
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

  // Fetch roles and permissions
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    mutate,
  } = useSWR<IApiResponse<IRole[]>>(BACKEND_ENDPOINTS.ROLES.GET_ALL);

  const { data: permissionsData, isLoading: isLoadingPermissions } = useSWR<
    IApiResponse<IPermission[]>
  >(BACKEND_ENDPOINTS.PERMISSIONS.GET_ALL);

  // Create role mutation
  const { trigger: createRole, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.ROLES.CREATE,
    sendPostRequest
  );

  // Group permissions by category
  const groupedPermissions = React.useMemo(() => {
    if (!permissionsData?.data) return [];

    const groups: { [key: string]: IPermission[] } = {};
    permissionsData.data.forEach((permission) => {
      const groupName = permission.name.split('.')[0];
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(permission);
    });

    return Object.entries(groups).map(([name, permissions]) => ({
      name,
      permissions,
    }));
  }, [permissionsData]);

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
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: IPermission[]) => permissions.map((p) => p.name).join(', '),
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

        <Table
          columns={columns}
          dataSource={rolesData?.data}
          loading={isLoadingRoles}
          rowKey="id"
        />

        <Modal
          title="Add Role"
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          footer={null}
          width={800}
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

            <Form.Item
              name="permissions"
              label={
                <div className="flex justify-between items-center">
                  <span>Permissions</span>
                  <span className="text-gray-500 text-sm">
                    {form.getFieldValue('permissions')?.length || 0} selected
                  </span>
                </div>
              }
            >
              {isLoadingPermissions ? (
                <div className="text-center py-4">Loading permissions...</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {groupedPermissions.map((group) => (
                    <div key={group.name} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Title level={5} className="mb-0 capitalize">
                          {group.name} Management
                        </Title>
                        <span className="text-gray-500 text-sm">
                          {form
                            .getFieldValue('permissions')
                            ?.filter((p: string) => group.permissions.some((gp) => gp.id === p))
                            .length || 0}
                          /{group.permissions.length}
                        </span>
                      </div>
                      <div className="pl-4">
                        {group.permissions.map((permission) => (
                          <Form.Item
                            key={permission.id}
                            name={['permissions', permission.id]}
                            valuePropName="checked"
                            noStyle
                          >
                            <div className="mb-2">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={(e) => {
                                    const permissions = form.getFieldValue('permissions') || [];
                                    if (e.target.checked) {
                                      form.setFieldValue('permissions', [
                                        ...permissions,
                                        permission.id,
                                      ]);
                                    } else {
                                      form.setFieldValue(
                                        'permissions',
                                        permissions.filter((p: string) => p !== permission.id)
                                      );
                                    }
                                  }}
                                />
                                <span>{permission.name.split('.').pop()}</span>
                              </label>
                            </div>
                          </Form.Item>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
