import BACKEND_ENDPOINTS from '@/api/endpoints';
import { IRole } from '@/types/role.types';
import { IUser } from '@/types/user.types';
import { Select, Table, message } from 'antd';
import useSWR, { mutate } from 'swr';

const { Option } = Select;

const AdminUserManagementPage = () => {
  const {
    data: users = [],
    error,
    isLoading,
  } = useSWR<IUser[]>(BACKEND_ENDPOINTS.USERS.GET_ALL_APPROVED);

  const { data: roles } = useSWR<IRole[]>(BACKEND_ENDPOINTS.ROLES.GET_ALL);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await mutate(
        BACKEND_ENDPOINTS.USERS.UPDATE_ROLE(userId),
        {
          role: newRole,
        },
        {
          optimisticData: users.map((user) =>
            user.userId === userId ? { ...user, role: newRole } : user
          ),
        }
      );

      message.success('User role updated successfully');
    } catch {
      message.error('Failed to update user role');
      // Revalidate to get the correct data
      mutate(BACKEND_ENDPOINTS.USERS.GET_ALL_APPROVED);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Office ID', dataIndex: 'officeId', key: 'officeId' },
    {
      title: 'Role',
      key: 'role',
      render: (record: IUser) => (
        <Select
          defaultValue={record.role}
          onChange={(value) => handleRoleChange(record.userId, value)}
        >
          {roles?.map((role) => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  if (error) {
    return <div>Failed to load users</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
      />
    </div>
  );
};

export default AdminUserManagementPage;
