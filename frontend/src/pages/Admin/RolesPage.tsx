import BACKEND_ENDPOINTS from '@/api/endpoints';
import { sendPostRequest, sendPutRequest } from '@/config/swrConfig';
import { IApiResponse } from '@/types/common';
import { IPermission } from '@/types/permission.types';
import { CreateRoleData, IRole } from '@/types/role.types';
import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
  Tree,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import React, { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const { Title } = Typography;

interface TreeTitleProps {
  children: string;
}

interface PermissionsTreeProps {
  formInstance: FormInstance<CreateRoleData>;
  isView?: boolean;
  permissionsData: IApiResponse<IPermission[]> | undefined;
  isLoadingPermissions: boolean;
  selectedCount: number;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck: (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => void;
  expandedKeys: React.Key[];
  autoExpandParent: boolean;
  onExpand: (newExpandedKeys: React.Key[]) => void;
  treeData: DataNode[];
}

const PermissionsTree: React.FC<PermissionsTreeProps> = ({
  formInstance,
  isView = false,
  isLoadingPermissions,
  selectedCount,
  onSearch,
  onCheck,
  expandedKeys,
  autoExpandParent,
  onExpand,
  treeData,
}) => (
  <Form.Item
    name="permissions"
    label={
      <Space className="w-full !min-w-full justify-between items-center">
        <span>Permissions</span>
        {!isView && (
          <Input
            placeholder="Search permissions or groups"
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={onSearch}
            className="w-64"
            allowClear
          />
        )}
      </Space>
    }
    rules={[{ required: true, message: 'Please select at least one permission' }]}
  >
    {isLoadingPermissions ? (
      <div className="text-center py-4">Loading permissions...</div>
    ) : (
      <Badge.Ribbon text={`${selectedCount} Selected`} color={selectedCount > 0 ? 'gold' : 'gray'}>
        <Card className="mb-4 max-h-96 overflow-y-auto">
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={formInstance.getFieldValue('permissions') || []}
            treeData={treeData}
            defaultExpandAll
            selectable={false}
            disabled={isView}
          />
        </Card>
      </Badge.Ribbon>
    )}
  </Form.Item>
);

interface CreateRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  form: FormInstance<CreateRoleData>;
  onFinish: (values: CreateRoleData) => Promise<void>;
  isLoading: boolean;
  treeProps: Omit<PermissionsTreeProps, 'formInstance' | 'isView'>;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  visible,
  onCancel,
  form,
  onFinish,
  isLoading,
  treeProps,
}) => (
  <Modal title="Add Role" open={visible} onCancel={onCancel} footer={null} width={800}>
    <Form form={form} layout="vertical" onFinish={onFinish}>
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

      <PermissionsTree formInstance={form} {...treeProps} />

      <Form.Item className="mb-0 text-right">
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </Modal>
);

interface EditRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  form: FormInstance<CreateRoleData>;
  onFinish: (values: CreateRoleData) => Promise<void>;
  isLoading: boolean;
  treeProps: Omit<PermissionsTreeProps, 'formInstance' | 'isView'>;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  visible,
  onCancel,
  form,
  onFinish,
  isLoading,
  treeProps,
}) => (
  <Modal title="Edit Role" open={visible} onCancel={onCancel} footer={null} width={800}>
    <Form form={form} layout="vertical" onFinish={onFinish}>
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

      <PermissionsTree formInstance={form} {...treeProps} />

      <Form.Item className="mb-0 text-right">
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </Modal>
);

interface ViewRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  role: IRole | null;
  treeProps: Omit<PermissionsTreeProps, 'formInstance' | 'isView'>;
  form: FormInstance<CreateRoleData>;
}

const ViewRoleModal: React.FC<ViewRoleModalProps> = ({
  visible,
  onCancel,
  role,
  treeProps,
  form,
}) => (
  <Modal
    title="View Role"
    open={visible}
    onCancel={onCancel}
    footer={[
      <Button key="close" onClick={onCancel}>
        Close
      </Button>,
    ]}
    width={800}
  >
    <Form layout="vertical" initialValues={role || {}}>
      <Form.Item name="name" label="Role Name">
        <Input disabled />
      </Form.Item>

      <PermissionsTree formInstance={form} isView {...treeProps} />
    </Form>
  </Modal>
);

const RolesPage: React.FC = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [form] = Form.useForm<CreateRoleData>();
  const [editForm] = Form.useForm<CreateRoleData>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);

  // Fetch roles and permissions
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    mutate,
  } = useSWR<IApiResponse<IRole[]>>(BACKEND_ENDPOINTS.ROLES.GET_ALL);

  const { data: permissionsData, isLoading: isLoadingPermissions } = useSWR<
    IApiResponse<IPermission[]>
  >(BACKEND_ENDPOINTS.PERMISSIONS.GET_ALL);

  // Create and update role mutations
  const { trigger: createRole, isMutating: isCreating } = useSWRMutation(
    BACKEND_ENDPOINTS.ROLES.CREATE,
    sendPostRequest
  );

  const { trigger: updateRole, isMutating: isUpdating } = useSWRMutation(
    BACKEND_ENDPOINTS.ROLES.UPDATE(selectedRole?.id || ''),
    sendPutRequest
  );

  const getSelectedCount = (permissions: IPermission[]) => {
    const selectedPermissions = form.getFieldValue('permissions') || [];
    return permissions.filter((p) => selectedPermissions.includes(p.id)).length;
  };

  // Convert permissions to tree data
  const treeData = React.useMemo(() => {
    if (!permissionsData?.data) return [];

    const groups: { [key: string]: IPermission[] } = {};
    permissionsData.data.forEach((permission) => {
      const groupName = permission.name.split('.')[0];
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(permission);
    });

    return Object.entries(groups).map(
      ([name, permissions]): DataNode => ({
        title: (
          <div className="flex items-center justify-between w-full pr-4 cursor-pointer">
            <span className="capitalize">{name} Management</span>
            <span className="text-gray-500 text-sm">
              {getSelectedCount(permissions)}/{permissions.length}
            </span>
          </div>
        ),
        key: name,
        children: permissions.map(
          (permission): DataNode => ({
            title: <span className="capitalize">{permission.name.split('.').pop()}</span>,
            key: permission.id,
            isLeaf: true,
            selectable: false,
          })
        ),
      })
    );
  }, [permissionsData, form.getFieldValue('permissions')]);

  const handleCreateRole = async (values: CreateRoleData) => {
    try {
      await createRole(values);
      message.success('Role created successfully');
      setIsCreateModalVisible(false);
      form.resetFields();
      mutate();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to create role');
      } else {
        message.error('Failed to create role');
      }
    }
  };

  const handleUpdateRole = async (values: CreateRoleData) => {
    try {
      await updateRole(values);
      message.success('Role updated successfully');
      setIsEditModalVisible(false);
      editForm.resetFields();
      mutate();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to update role');
      } else {
        message.error('Failed to update role');
      }
    }
  };

  const handleViewRole = (role: IRole) => {
    setSelectedRole(role);
    form.setFieldsValue({
      name: role.name,
      permissions: role.permissions.map((p) => p.id),
    });
    setSelectedCount(role.permissions.length);
    setExpandedKeys(role.permissions.map((p) => p.id));
    setAutoExpandParent(true);
    setIsViewModalVisible(true);
  };

  const handleEditRole = (role: IRole) => {
    setSelectedRole(role);
    editForm.setFieldsValue({
      name: role.name,
      permissions: role.permissions.map((p) => p.id),
    });
    setSelectedCount(role.permissions.length);
    setExpandedKeys(role.permissions.map((p) => p.id));
    setAutoExpandParent(true);
    setIsEditModalVisible(true);
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleViewRole(record)} type="link" />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEditRole(record)} type="link" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (
    checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] },
    formInstance: FormInstance<CreateRoleData>
  ) => {
    const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
    const filteredKeys = checkedKeys
      .filter((key): key is string => typeof key === 'string')
      .filter((key) => {
        return permissionsData?.data.some((permission) => permission.id === key);
      });

    formInstance.setFieldValue('permissions', filteredKeys);
    setSelectedCount(filteredKeys.length);
    setExpandedKeys(checkedKeys);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);

    if (value) {
      const expandedNodes = new Set<string>();
      permissionsData?.data.forEach((permission) => {
        if (
          permission.name.toLowerCase().includes(value.toLowerCase()) ||
          permission.name.split('.')[0].toLowerCase().includes(value.toLowerCase())
        ) {
          expandedNodes.add(permission.name.split('.')[0]);
        }
      });
      setExpandedKeys(Array.from(expandedNodes));
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setAutoExpandParent(false);
    }
  };

  const filteredTreeData = React.useMemo(() => {
    if (!searchQuery) return treeData;
    return treeData
      .map((node) => {
        const children = (node.children as DataNode[]).filter((child) => {
          const title = child.title as React.ReactElement<TreeTitleProps>;
          return (
            title.props.children.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.key.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
        if (children.length > 0) {
          return { ...node, children };
        }
        return null;
      })
      .filter(Boolean) as DataNode[];
  }, [treeData, searchQuery]);

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setSelectedRole(null);
    setSelectedCount(0);
    setExpandedKeys([]);
    setAutoExpandParent(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRole(null);
    form.resetFields();
    setSelectedCount(0);
    setExpandedKeys([]);
    setAutoExpandParent(false);
  };

  const treeProps = {
    permissionsData,
    isLoadingPermissions,
    selectedCount,
    onSearch,
    onCheck: (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
      const activeForm = isEditModalVisible ? editForm : form;
      onCheck(checked, activeForm);
    },
    expandedKeys,
    autoExpandParent,
    onExpand,
    treeData: filteredTreeData,
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Role Management</Title>
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          Create Role
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={rolesData?.data}
        loading={isLoadingRoles}
        rowKey="id"
        pagination={false}
      />

      <CreateRoleModal
        visible={isCreateModalVisible}
        onCancel={handleCloseCreateModal}
        form={form}
        onFinish={handleCreateRole}
        isLoading={isCreating}
        treeProps={treeProps}
      />

      <EditRoleModal
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        form={editForm}
        onFinish={handleUpdateRole}
        isLoading={isUpdating}
        treeProps={treeProps}
      />

      <ViewRoleModal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        role={selectedRole}
        treeProps={treeProps}
        form={form}
      />
    </Card>
  );
};

export default RolesPage;
