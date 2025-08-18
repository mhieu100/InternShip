import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  message,
  Select,
  Space,
  Switch
} from 'antd'
import { ICamera } from 'types/backend'
import { callCreateCamera, callUpdateCamera } from 'services/camera.api'
import { useState } from 'react'

interface IProps {
  form: FormInstance
  editing: ICamera | null
  openAdd: boolean
  setOpenAdd: (open: boolean) => void
  fetchCameras: () => void
}

const DrawerCamera = (props: IProps) => {
  const { form, editing, openAdd, setOpenAdd, fetchCameras } = props
  const [initCheckBox, setInitCheckBox] = useState(true)

  const onChangeBox = () => {
    if (!initCheckBox) {
      setInitCheckBox(true)
    } else {
      setInitCheckBox(false)
    }
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
  return (
    <>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              initialValue={initCheckBox}
            >
              <Switch
                onChange={() => onChangeBox()}
                checkedChildren="Public"
                unCheckedChildren="Private"
              />
            </Form.Item>
            {initCheckBox ? (
              ' '
            ) : (
              <>
                <Form.Item
                  name="user"
                  label="User"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input type="password" />
                </Form.Item>
              </>
            )}
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default DrawerCamera
