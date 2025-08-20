/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Dropdown,
  message,
  Typography
} from 'antd'
import {
  SearchOutlined,
  MoreOutlined,
  LinkOutlined,
  GlobalOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { ICamera } from 'types/backend'
import { callDeleteCamera } from 'services/camera.api'
import DrawerCamera from 'components/drawer/drawer.camera'
import { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { fetchCamera } from 'redux/slices/cameraSilce'

const TYPES = [
  'INDOOR',
  'OUTDOOR',
  'SECURITY',
  'MONITORING',
  'TRAFFIC'
] as const
const { Text } = Typography
const ManagementCamera = () => {
  const [openAdd, setOpenAdd] = useState(false)
  const [editing, setEditing] = useState<ICamera | null>(null)
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: string]: boolean
  }>({})
  const [form] = Form.useForm()

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const isFetching = useAppSelector((state) => state.camera.isFetching)
  const meta = useAppSelector((state) => state.camera.meta)
  const cameras = useAppSelector<ICamera[]>((state) => state.camera.result)
  const dispatch = useAppDispatch()

  console.log(cameras)
  const columns: ColumnsType<ICamera> = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>
      }
    },
    {
      title: 'Camera Info',
      fixed: 'left',
      width: 280,
      render: (_: any, camera: ICamera) => (
        <div className="flex flex-col gap-2">
          <div className="font-medium">{camera.name}</div>
          <div className="text-sm text-gray-500">
            <LinkOutlined /> {camera.streamUrl}
          </div>
          <div className="text-sm text-gray-500">
            <GlobalOutlined /> {camera.location}
          </div>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (v: string) => <Tag>{v}</Tag>
    },
    {
      title: 'Access',
      dataIndex: 'isPublic',
      render: (v: boolean) => (
        <Space>
          <Tag color={v ? 'green' : 'default'}>{v ? 'Public' : 'Private'}</Tag>
        </Space>
      )
    },
    {
      title: 'Secure',
      align: 'left',
      render: (_: any, record: ICamera) =>
        record.username && record.password ? (
          <div className="flex flex-col">
            <Text>Username : {record.username}</Text>
            <div className="flex items-center gap-2">
              <Text>
                Password :{' '}
                {visiblePasswords[record.id] ? record.password : '••••••'}
              </Text>
              <Button
                type="text"
                size="small"
                icon={
                  visiblePasswords[record.id] ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )
                }
                onClick={() => togglePasswordVisibility(record.id)}
                className="flex items-center justify-center"
              />
            </div>
          </div>
        ) : (
          <Text>NaN</Text>
        )
    },
    {
      title: 'Actions',
      fixed: 'right',
      render: (_: any, rec: ICamera) => (
        <Dropdown
          menu={{
            items: [
              {
                icon: <EditOutlined />,
                key: 'edit',
                label: 'Edit',
                onClick: () => onEdit(rec)
              },
              {
                icon: <DeleteOutlined />,
                key: 'delete',
                label: 'Delete',
                danger: true,
                onClick: () => onDelete(rec)
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

  useEffect(() => {
    dispatch(fetchCamera())
  }, [dispatch])

  const onAdd = () => {
    setEditing(null)
    form.resetFields()
    setOpenAdd(true)
  }
  const onEdit = (rec: ICamera) => {
    setEditing(rec)
    form.setFieldsValue(rec)
    setOpenAdd(true)
  }
  const onDelete = (rec: ICamera) => {
    Modal.confirm({
      title: `Xóa camera ${rec.name}?`,
      onOk: async () => {
        await callDeleteCamera(rec.id)
        message.success('Delete camera success')
        dispatch(fetchCamera())
      }
    })
  }

  const filteredList = cameras.filter((camera) => {
    const matchesSearch = camera.name
      .toLowerCase()
      .includes(searchText.toLowerCase())

    const matchesType = typeFilter === 'all' || camera.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Camera Management</h1>
        <Button type="primary" onClick={onAdd}>
          Add Camera
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Search cameras..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: 'All Types' },
              ...TYPES.map((t) => ({ value: t, label: t }))
            ]}
          />
        </div>

        <Table
          rowKey="id"
          loading={isFetching}
          dataSource={filteredList}
          scroll={{ x: 800 }}
          columns={columns}
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
        />
      </Card>

      <DrawerCamera
        form={form}
        editing={editing}
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
      />
    </div>
  )
}

export default ManagementCamera
