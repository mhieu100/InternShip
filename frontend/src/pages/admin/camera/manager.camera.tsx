import { Button, Card, Drawer, Form, Input, Modal, Select, Space, Switch, Table, Tag, Dropdown, InputNumber } from 'antd'
import { SearchOutlined, MoreOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import { api } from 'services/api';
import { ICamera } from 'types/backend';

const PROTOCOLS = ['RTSP', 'HLS', 'WebRTC'] as const
const TYPES = ['Indoor', 'Outdoor'] as const

const ManagementCamera = () => {
    const [list, setList] = useState<ICamera[]>([])
    const [loading, setLoading] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)
    const [editing, setEditing] = useState<ICamera | null>(null)
    const [searchText, setSearchText] = useState('')
    const [protocolFilter, setProtocolFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [form] = Form.useForm()

    const load = async () => {
        setLoading(true)
        const data = await api.listCameras()
        setList(data)
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const onAdd = () => { setEditing(null); form.resetFields(); setOpenAdd(true) }
    const onEdit = (rec: ICamera) => { setEditing(rec); form.setFieldsValue(rec); setOpenAdd(true) }
    const onDelete = (rec: ICamera) => {
        Modal.confirm({ title: `Xóa camera ${rec.name}?`, onOk: async () => { await api.deleteCamera(rec.id); load() } })
    }

    const onSubmit = async () => {
        const values = await form.validateFields()
        if (editing) {
            await api.updateCamera(editing.id, values)
        } else {
            await api.createCamera({ ...values, enabled: true, status: 'ONLINE' })
        }
        setOpenAdd(false)
        load()
    }

    const filteredList = list.filter(camera => {
        const matchesSearch =
            camera.name.toLowerCase().includes(searchText.toLowerCase()) ||
            camera.code.toLowerCase().includes(searchText.toLowerCase()) ||
            camera.zone.toLowerCase().includes(searchText.toLowerCase());
        const matchesProtocol = protocolFilter === 'all' || camera.protocol === protocolFilter;
        const matchesType = typeFilter === 'all' || camera.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
        return matchesSearch && matchesProtocol && matchesType && matchesStatus;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Camera Management</h1>
                <Button type="primary" onClick={onAdd}>Add Camera</Button>
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
                        value={protocolFilter}
                        onChange={setProtocolFilter}
                        style={{ width: 120 }}
                        options={[
                            { value: 'all', label: 'All Protocols' },
                            ...PROTOCOLS.map(p => ({ value: p, label: p }))
                        ]}
                    />
                    <Select
                        value={typeFilter}
                        onChange={setTypeFilter}
                        style={{ width: 120 }}
                        options={[
                            { value: 'all', label: 'All Types' },
                            ...TYPES.map(t => ({ value: t, label: t }))
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
                                <div className="flex flex-col">
                                    <div className="font-medium">{camera.name}</div>
                                    <div className="text-gray-500 text-sm">{camera.code}</div>
                                    <div className="text-gray-500 text-sm">{camera.zone}</div>
                                </div>
                            )
                        },
                        {
                            title: 'Protocol',
                            dataIndex: 'protocol',
                            width: 100,
                            render: (v: string) => <Tag>{v}</Tag>
                        },
                        {
                            title: 'Type',
                            dataIndex: 'type',
                            width: 100,
                            render: (v: string) => <Tag>{v}</Tag>
                        },
                        {
                            title: 'Group',
                            dataIndex: 'group',
                            width: 150
                        },
                        {
                            title: 'Status',
                            width: 120,
                            render: (_: any, camera: ICamera) => (
                                <Space>
                                    <Tag color={camera.enabled ? 'green' : 'default'}>
                                        {camera.enabled ? 'Enabled' : 'Disabled'}
                                    </Tag>
                                    <Tag color={camera.status === 'ONLINE' ? 'green' : camera.status === 'OFFLINE' ? 'red' : 'orange'}>
                                        {camera.status}
                                    </Tag>
                                </Space>
                            )
                        },
                        {
                            title: 'Actions',
                            fixed: 'right',
                            width: 80,
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
                        },
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
                        <Button type="primary" onClick={onSubmit}>Save</Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{ protocol: 'RTSP', type: 'Indoor', enabled: true }}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item name="streamUrl" label="Stream URL" rules={[{ required: true }]}>
                        <Input placeholder="rtsp:// or http(s)://..." />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="protocol" label="Protocol" rules={[{ required: true }]}>
                            <Select options={PROTOCOLS.map(v => ({ value: v, label: v }))} />
                        </Form.Item>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select options={TYPES.map(v => ({ value: v, label: v }))} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="zone" label="Zone" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="group" label="Group">
                            <Input placeholder="e.g., Office Cameras" />
                        </Form.Item>
                    </div>

                    <Form.Item name="enabled" label="Status" valuePropName="checked">
                        <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}

export default ManagementCamera