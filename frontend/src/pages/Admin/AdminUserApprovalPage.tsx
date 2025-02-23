import BACKEND_ENDPOINTS from '@/api/endpoints';
import { sendPutRequest } from '@/config/swrConfig';
import { IApiResponse } from '@/types/common';
import { IRole } from '@/types/role.types';
import { IUser } from '@/types/user.types';
import { Button, Card, Select, Table, message } from 'antd';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

const { Option } = Select;

interface UserRoleMap {
  [key: string]: string;
}

const AdminUserApprovalPage = () => {
  const {
    data: users,
    error,
    isLoading,
  } = useSWR<IApiResponse<IUser[]>>(BACKEND_ENDPOINTS.USERS.GET_ALL_PENDING);

  const { data: roles } = useSWR<IApiResponse<IRole[]>>(BACKEND_ENDPOINTS.ROLES.GET_ALL);
  const [selectedRoles, setSelectedRoles] = useState<UserRoleMap>({});

  // Mutation for approving users
  const { trigger: approveUser, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.USERS.UPDATE_STATUS(''),
    sendPutRequest
  );

  const handleApprove = async (userId: string) => {
    try {
      const roleId = selectedRoles[userId];
      if (!roleId) {
        message.error('Please select a role for the user');
        return;
      }

      await approveUser({
        isApproved: true,
        roleId,
      });

      message.success('User approved successfully');

      // Optimistically remove the approved user from the list
      if (users?.data) {
        mutate(
          BACKEND_ENDPOINTS.USERS.GET_ALL_PENDING,
          {
            ...users,
            data: users.data.filter((user) => user.userId !== userId),
          },
          false
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to approve user');
      } else {
        message.error('Failed to approve user');
      }
      // Revalidate to get the correct data
      mutate(BACKEND_ENDPOINTS.USERS.GET_ALL_PENDING);
    }
  };

  const handleRoleChange = (userId: string, roleId: string) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: roleId,
    }));
  };

  const columns = [
    { title: 'Full Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Office ID', dataIndex: 'officeId', key: 'officeId' },
    {
      title: 'Role',
      key: 'role',
      render: (record: IUser) => (
        <Select
          placeholder="Select role"
          onChange={(value) => handleRoleChange(record.userId, value)}
          value={selectedRoles[record.userId]}
          style={{ width: '200px' }}
        >
          {roles?.data?.map((role) => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: IUser) => (
        <Button
          onClick={() => handleApprove(record.userId)}
          type="primary"
          loading={isMutating}
          disabled={!selectedRoles[record.userId]}
        >
          Approve
        </Button>
      ),
    },
  ];

  if (error) {
    return <div>Failed to load pending users</div>;
  }

  return (
    <Card title="Pending User Approvals">
      <Table
        dataSource={users?.data || []}
        columns={columns}
        rowKey="userId"
        loading={isLoading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
      />
    </Card>
  );
};

export default AdminUserApprovalPage;
