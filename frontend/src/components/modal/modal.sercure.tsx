import { useState } from 'react'
import { Form, Input, Modal } from 'antd'

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

    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    setOpen(false)
  }

  return (
    <>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
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
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input type="password" />
          </Form.Item>

          {/* <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                SUbmit
              </Button>
            </Space>
          </div> */}
        </Form>
      </Modal>
    </>
  )
}

export default ModalSecure
