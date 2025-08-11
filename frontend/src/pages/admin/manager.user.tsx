import { Key, useEffect, useState } from 'react'
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
  Badge
} from 'antd'
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  MailOutlined,
  CalendarOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { IUser } from 'types/backend'
import {
  callCreateUser,
  callDeleteUser,
  callGetUsers,
  callUpdateUser
} from 'services/user.api'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select

const ManagementUser = () => {
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | Key[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [form] = Form.useForm()
  const [users, setUsers] = useState<IUser[]>([])

  const fetchUsers = async () => {
    const response = await callGetUsers()
    setUsers(response.data.result)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'red',
      editor: 'blue',
      author: 'green',
      subscriber: 'default'
    }
    return colors[role] || 'default'
  }

  const handleEdit = (user: IUser) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setIsModalVisible(true)
  }

  const handleDelete = async (userId: string) => {
    await callDeleteUser(userId)
    fetchUsers()
    message.success('User deleted successfully')
  }

  const handleSave = async (values: IUser) => {
    if (editingUser && editingUser.id) {
      const response = await callUpdateUser(editingUser.id, values)
      console.log(response)
      fetchUsers()
      message.success('User updated successfully')
    } else {
      // Add new user
      const response = await callCreateUser(values)
      if (response && response.data) {
        fetchUsers()
        message.success('User created successfully')
      } else {
        message.error(`Create user faild, ${response.error}`)
      }
    }
    setIsModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  const userActions = (record) => [
    {
      key: 'view',
      label: 'View Profile',
      icon: <EyeOutlined />,
      onClick: () => message.info(`Viewing profile for ${record.name}`)
    },
    {
      key: 'edit',
      label: 'Edit User',
      icon: <EditOutlined />,
      onClick: () => handleEdit(record)
    },
    {
      key: 'email',
      label: 'Send Email',
      icon: <MailOutlined />,
      onClick: () => message.info(`Sending email to ${record.email}`)
    },
    {
      type: 'divider'
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
          onOk: () => handleDelete(record.id)
        })
      }
    }
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

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
            <Avatar src={record.avatar} size={40} style={{ marginRight: 12 }}>
              {record.name.charAt(0)}
            </Avatar>
          </Badge>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </div>
            {record.address && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                <GlobalOutlined style={{ marginRight: 4 }} />
                {record.address}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>{role.toUpperCase()}</Tag>
      )
    },

    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
      render: (date) => (
        <div style={{ fontSize: '12px' }}>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {dayjs(date).format('DD-MM-YYYY HH:mm')}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: userActions(record).map((item) => ({
              ...item,
              onClick: item.onClick ? () => item.onClick() : undefined
            }))
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}
      >
        <h1>User Management</h1>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => {
            setEditingUser(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Add User
        </Button>
      </div>

      <Card>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
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
          rowKey={'id'}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingUser(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
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
            <Input disabled={editingUser ? true : false} />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="USER">User</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ManagementUser
