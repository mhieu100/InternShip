import { Button, Card, Form, Input, InputNumber, Select, Switch } from 'antd'
import { useEffect } from 'react'
import { api } from 'services/api'

const SettingCamera = () => {
  const [form] = Form.useForm()

  useEffect(() => {
    api.getSystemConfig().then((cfg) => form.setFieldsValue(cfg))
  }, [form])

  const onSave = async () => {
    const v = await form.validateFields()
    await api.updateSystemConfig(v)
  }

  return (
    <Card title="Cấu hình hệ thống" className="mx-auto w-full max-w-[1200px]">
      <Form layout="vertical" form={form} className="w-full">
        <Card type="inner" title="Media Server" className="mb-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item
              name={['mediaServer', 'type']}
              label="Loại"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select
                options={[
                  { value: 'MediaMTX' },
                  { value: 'Wowza' },
                  { value: 'Nginx-RTMP' }
                ]}
              />
            </Form.Item>
            <Form.Item
              name={['mediaServer', 'host']}
              label="Host"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['mediaServer', 'port']}
              label="Port"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <InputNumber min={1} max={65535} className="w-full" />
            </Form.Item>
          </div>
        </Card>

        <Card type="inner" title="DNS & Domain" className="mb-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name={['dns', 'domain']}
              label="Domain"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['dns', 'ssl']}
              label="SSL"
              valuePropName="checked"
              className="mb-0"
            >
              <Switch />
            </Form.Item>
          </div>
        </Card>

        <Card type="inner" title="Streaming" className="mb-4">
          <Form.Item
            name={['streaming', 'protocols']}
            label="Protocols"
            rules={[{ required: true }]}
            className="mb-0"
          >
            <Select
              mode="multiple"
              options={[{ value: 'WebRTC' }, { value: 'HLS' }]}
            />
          </Form.Item>
        </Card>

        <Card type="inner" title="Health Check" className="mb-4">
          <Form.Item
            name={['health', 'intervalSec']}
            label="Chu kỳ (giây)"
            rules={[{ required: true }]}
            className="mb-0"
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </Card>

        <Button type="primary" onClick={onSave}>
          Lưu cấu hình
        </Button>
      </Form>
    </Card>
  )
}

export default SettingCamera
