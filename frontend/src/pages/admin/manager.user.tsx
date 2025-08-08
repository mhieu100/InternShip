import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Avatar,
  Tag,
  Dropdown,
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManagementUser = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Sample users data
  const [users, setUsers] = useState([
    {
      key: '1',
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      role: 'admin',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15 10:30:00',
      joinDate: '2023-06-15',
      postsCount: 25,
      commentsCount: 150,
    },
    {
      key: '2',
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8901',
      role: 'editor',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-14 15:45:00',
      joinDate: '2023-08-20',
      postsCount: 18,
      commentsCount: 89,
    },
    {
      key: '3',
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 234 567 8902',
      role: 'author',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-13 09:15:00',
      joinDate: '2023-09-10',
      postsCount: 12,
      commentsCount: 45,
    },
    {
      key: '4',
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 234 567 8903',
      role: 'subscriber',
      status: 'inactive',
      avatar: null,
      lastLogin: '2024-01-10 14:20:00',
      joinDate: '2023-11-05',
      postsCount: 0,
      commentsCount: 23,
    },
  ]);

  const getRoleColor = (role) => {
    const colors = {
      admin: 'red',
      editor: 'blue',
      author: 'green',
      subscriber: 'default',
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red';
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('User deleted successfully');
  };

  const handleSave = async (values) => {
    try {
      if (editingUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values }
            : user
        ));
        message.success('User updated successfully');
      } else {
        // Add new user
        const newUser = {
          ...values,
          key: String(users.length + 1),
          id: users.length + 1,
          avatar: null,
          lastLogin: 'Never',
          joinDate: new Date().toISOString().split('T')[0],
          postsCount: 0,
          commentsCount: 0,
        };
        setUsers([...users, newUser]);
        message.success('User created successfully');
      }
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user');
    }
  };

  const userActions = (record) => [
    {
      key: 'view',
      label: 'View Profile',
      icon: <EyeOutlined />,
      onClick: () => message.info(`Viewing profile for ${record.name}`),
    },
    {
      key: 'edit',
      label: 'Edit User',
      icon: <EditOutlined />,
      onClick: () => handleEdit(record),
    },
    {
      key: 'email',
      label: 'Send Email',
      icon: <MailOutlined />,
      onClick: () => message.info(`Sending email to ${record.email}`),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete User',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: 'Are you sure you want to delete this user?',
          content: `This will permanently delete ${record.name} and all associated data.`,
          okText: 'Yes, Delete',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: () => handleDelete(record.id),
        });
      },
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge 
            status={record.status === 'active' ? 'success' : 'error'}
            offset={[-5, 35]}
          >
            <Avatar 
              src={record.avatar} 
              size={40}
              style={{ marginRight: 12 }}
            >
              {record.name.charAt(0)}
            </Avatar>
          </Badge>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </div>
            {record.phone && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                <PhoneOutlined style={{ marginRight: 4 }} />
                {record.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Activity',
      key: 'activity',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>{record.postsCount} posts</div>
          <div>{record.commentsCount} comments</div>
        </div>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => (
        <div style={{ fontSize: '12px' }}>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
        </div>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{ 
            items: userActions(record).map(item => ({
              ...item,
              onClick: item.onClick ? () => item.onClick() : undefined,
            }))
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>User Management</h1>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />}
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add User
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Search
            placeholder="Search users..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 120 }}
          >
            <Option value="all">All Roles</Option>
            <Option value="admin">Admin</Option>
            <Option value="editor">Editor</Option>
            <Option value="author">Author</Option>
            <Option value="subscriber">Subscriber</Option>
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="editor">Editor</Option>
              <Option value="author">Author</Option>
              <Option value="subscriber">Subscriber</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementUser;