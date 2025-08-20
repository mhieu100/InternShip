/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, useEffect, useState } from 'react'
import {
  Table,
  Card,
  Button,
  Input,
  Select,
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
import { callDeleteUser } from 'services/user.api'
import dayjs from 'dayjs'
import ModalUser from 'components/modal/modal.user'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { ColumnsType } from 'antd/es/table'
import { fetchUser } from 'redux/slices/userSilce'
import { getRoleColor } from 'utils/status.color'

const { Search } = Input
const { Option } = Select

const ManagementUser = () => {
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | Key[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [form] = Form.useForm()

  const isFetching = useAppSelector((state) => state.user.isFetching)
  const meta = useAppSelector((state) => state.user.meta)
  const users = useAppSelector<IUser[]>((state) => state.user.result)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  const handleEdit = (user: IUser) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setIsModalVisible(true)
  }

  const handleDelete = async (userId: string) => {
    await callDeleteUser(userId)
    dispatch(fetchUser())
    message.success('User deleted successfully')
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const columns: ColumnsType<IUser> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>
      }
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            // status={record.status === 'active' ? 'success' : 'error'}
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
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role.toUpperCase()}</Tag>
      )
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      render: (_, record: IUser) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Profile',
                icon: <EyeOutlined />,
                onClick: () =>
                  message.info(`Viewing profile for ${record.name}`)
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
                type: 'divider' as const
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
            <Option value="ADMIN">Admin</Option>
            <Option value="USER">User</Option>
          </Select>
        </div>

        <Table
          rowKey={'id'}
          loading={isFetching}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            current: meta.page,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]}-{range[1]} / {total} rows
                </div>
              )
            }
          }}
          scroll={{ x: 800 }}
        />
      </Card>
      <ModalUser
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        form={form}
      />
    </div>
  )
}

export default ManagementUser
