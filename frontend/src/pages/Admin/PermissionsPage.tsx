import BACKEND_ENDPOINTS from '@/api/endpoints';
import { IApiResponse } from '@/types/common';
import { IPermission } from '@/types/permission.types';
import { Card, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import useSWR from 'swr';

const { Title } = Typography;

const PermissionsPage: React.FC = () => {
  // const { user } = useAuth();
  // const navigate = useNavigate();

  // Redirect if not admin
  // React.useEffect(() => {
  //   if (user && user.role !== 'admin') {
  //     navigate('/unauthorized');
  //   }
  // }, [user, navigate]);

  // Fetch permissions
  const { data: permissionsData, isLoading } = useSWR<IApiResponse<IPermission[]>>(
    BACKEND_ENDPOINTS.PERMISSIONS.GET_ALL
  );

  const columns: ColumnsType<IPermission> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
          <Title level={2}>System Permissions</Title>
        </div>

        <Table
          columns={columns}
          dataSource={permissionsData?.data}
          loading={isLoading}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default PermissionsPage;
