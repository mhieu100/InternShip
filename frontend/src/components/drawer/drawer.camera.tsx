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
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { fetchCamera } from 'redux/slices/cameraSilce'

interface IProps {
  form: FormInstance
  editing: ICamera | null
  open: boolean
  setOpen: (open: boolean) => void
}

const DrawerCamera = (props: IProps) => {
  const { form, editing, open, setOpen } = props
  const [initCheckBox, setInitCheckBox] = useState(true)
  const user = useAppSelector((state) => state.account.user)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue(editing)
        form.setFieldValue('username', user.email)
        setInitCheckBox(editing.isPublic)
      } else {
        form.resetFields()
        form.setFieldsValue({ username: user.email, isPublic: true })
        setInitCheckBox(true)
      }
    }
  }, [open, editing, form, user.email])

  const onChangeBox = () => {
    if (!initCheckBox) {
      setInitCheckBox(true)
    } else {
      setInitCheckBox(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    form.resetFields()
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      const response = await callUpdateCamera(editing.id, values)
      if (response && response.data) {
        message.success('Camera updated successfully')
      } else {
        message.error(
          `Failed to update camera. ${response?.error || 'Unknown error'}`
        )
      }
    } else {
      const response = await callCreateCamera(values)
      if (response && response.data) {
        message.success('Camera added successfully')
      } else {
        message.error(
          `Failed to add camera. ${response?.error || 'Unknown error'}`
        )
      }
    }
    setOpen(false)
    dispatch(fetchCamera())
  }

  return (
    <>
      <Drawer
        title={editing ? 'Edit Camera' : 'Add Camera'}
        open={open}
        onClose={handleClose}
        width={window.innerWidth > 520 ? 520 : '100%'}
        extra={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" onClick={onSubmit}>
              Save
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={
            editing ? editing : { username: user.email, isPublic: initCheckBox }
          }
          className="flex flex-col gap-4"
        >
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
            <Form.Item name="isPublic" label="Access" valuePropName="checked">
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
                <Form.Item name="username" label="Username">
                  <Input disabled />
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
