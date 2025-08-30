import { useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
  handleSecure: (email: string, password: string) => void
}

const ModalSecure = (props: IProps) => {
  const { open, setOpen, handleSecure } = props
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  const handleOk = () => {
    setConfirmLoading(true)
    const { email, password } = form.getFieldsValue()
    handleSecure(email, password)
    setConfirmLoading(false)
    form.resetFields()
    setOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setOpen(false)
  }

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <LockOutlined className="text-blue-500" />
            Secure Camera Access
          </div>
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Secure Camera"
        cancelText="Cancel"
        width={450}
        className="secure-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              size="large"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModalSecure
