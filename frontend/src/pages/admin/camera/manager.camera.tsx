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
  message
} from 'antd'
import {
  SearchOutlined,
  MoreOutlined,
  LinkOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { ICamera } from 'types/backend'
import { callDeleteCamera, callGetCameras } from 'services/camera.api'
import DrawerCamera from 'components/drawer/drawer.camera'

const TYPES = [
  'INDOOR',
  'OUTDOOR',
  'SECURITY',
  'MONITORING',
  'TRAFFIC'
] as const

const ManagementCamera = () => {
  const [list, setList] = useState<ICamera[]>([])
  const [loading, setLoading] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [editing, setEditing] = useState<ICamera | null>(null)
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [form] = Form.useForm()

  const fetchCameras = async () => {
    setLoading(true)
    const response = await callGetCameras()
    if (response && response.data) {
      setList(response.data.result)
      setLoading(false)
    } else {
      message.error(`Error fetch cameras ${response.error}`)
    }
  }

  useEffect(() => {
    fetchCameras()
  }, [])

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
        fetchCameras()
      }
    })
  }

  const filteredList = list.filter((camera) => {
    const matchesSearch = camera.name
      .toLowerCase()
      .includes(searchText.toLowerCase())

    const matchesType = typeFilter === 'all' || camera.type === typeFilter
    const matchesStatus =
      statusFilter === 'all' || camera.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
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
        <div className="flex flex-wrap gap-4 mb-4">
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
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'ONLINE', label: 'Online' },
              { value: 'OFFLINE', label: 'Offline' }
            ]}
          />
        </div>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredList}
          scroll={{ x: 800 }}
          columns={[
            {
              title: 'Camera Info',
              fixed: 'left',
              width: 300,
              render: (_: any, camera: ICamera) => (
                <div className="flex flex-col gap-2">
                  <div className="font-medium">{camera.name}</div>
                  <div className="text-gray-500 text-sm">
                    <LinkOutlined /> {camera.streamUrl}
                  </div>
                  <div className="text-gray-500 text-sm">
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
              dataIndex: 'public',
              render: (v: boolean) => (
                <Space>
                  <Tag color={v ? 'green' : 'default'}>
                    {v ? 'Public' : 'Private'}
                  </Tag>
                </Space>
              )
            },
            {
              title: 'Status',
              render: (_: any, camera: ICamera) => (
                <Space>
                  <Tag
                    color={
                      camera.status === 'ONLINE'
                        ? 'green'
                        : camera.status === 'OFFLINE'
                          ? 'red'
                          : 'orange'
                    }
                  >
                    {camera.status}
                  </Tag>
                </Space>
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
                        key: 'edit',
                        label: 'Edit',
                        onClick: () => onEdit(rec)
                      },
                      {
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
          ]}
        />
      </Card>

      <DrawerCamera
        form={form}
        editing={editing}
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        fetchCameras={fetchCameras}
      />
    </div>
  )
}

export default ManagementCamera
