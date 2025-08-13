import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
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
import {
  callCreateCamera,
  callDeleteCamera,
  callGetCameras,
  callUpdateCamera
} from 'services/camera.api'

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
    setList(response.data.result)
    setLoading(false)
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

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      const response = await callUpdateCamera(editing.id, values)
      if (response && response.data) {
        message.success('Camera updated successfully')
      } else {
        message.error(
          `Failed to update camera. ${response?.message || 'Unknown error'}`
        )
      }
    } else {
      const response = await callCreateCamera(values)
      if (response && response.data) {
        console.log(response)
        message.success('Camera added successfully')
      } else {
        message.error(
          `Failed to add camera. ${response?.message || 'Unknown error'}`
        )
      }
    }
    setOpenAdd(false)
    fetchCameras()
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
      <div className="flex justify-between items-center mb-6">
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

      <Drawer
        title={editing ? 'Edit Camera' : 'Add Camera'}
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        width={window.innerWidth > 520 ? 520 : '100%'}
        extra={
          <Space>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button type="primary" onClick={onSubmit}>
              Save
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="streamUrl"
            label="Stream URL"
            extra="URL luồng video trực tiếp từ camera (Chỉ hỗ trợ RTSP)"
            rules={[
              {
                required: true,
                message: 'Stream URL không được để trống'
              },
              {
                pattern: /^rtsp:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/,
                message:
                  'Stream URL phải là định dạng RTSP hợp lệ (ví dụ: rtsp://ip:port/stream)'
              },
              {
                max: 255,
                message: 'Stream URL không được vượt quá 255 ký tự'
              }
            ]}
          >
            <Input
              placeholder="Ví dụ: rtsp://camera-ip:port/stream"
              className="font-mono"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Vui lòng chọn loại camera' }]}
            >
              <Select placeholder="Chọn loại camera">
                <Select.Option value="SECURITY">SECURITY</Select.Option>
                <Select.Option value="MONITORING">MONITORING</Select.Option>
                <Select.Option value="TRAFFIC">TRAFFIC</Select.Option>
                <Select.Option value="INDOOR">INDOOR</Select.Option>
                <Select.Option value="OUTDOOR">OUTDOOR</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="isPublic"
              label="Access"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Public" unCheckedChildren="Private" />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}

export default ManagementCamera
