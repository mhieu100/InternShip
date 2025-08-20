import {
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  FormInstance
} from 'antd'
import { IUser } from 'types/backend'
import { callCreateUser, callUpdateUser } from 'services/user.api'
import { useAppDispatch } from 'redux/hook'
import { fetchUser } from 'redux/slices/userSilce'

interface ModalUserProps {
  isModalVisible: boolean
  setIsModalVisible: (visible: boolean) => void
  editingUser: IUser | null
  setEditingUser: (user: IUser | null) => void
  form: FormInstance
}

const ModalUser = (props: ModalUserProps) => {
  const {
    isModalVisible,
    setIsModalVisible,
    editingUser,
    setEditingUser,
    form
  } = props
  const dispatch = useAppDispatch()
  const handleSave = async (values: IUser) => {
    if (editingUser && editingUser.id) {
      const response = await callUpdateUser(editingUser.id, values)
      if (response && response.data) {
        dispatch(fetchUser())
        message.success('User updated successfully')
      } else {
        message.error(`Update user faild, ${response.error}`)
      }
    } else {
      const response = await callCreateUser(values)
      if (response && response.data) {
        dispatch(fetchUser())
        message.success('User created successfully')
      } else {
        message.error(`Create user faild, ${response.error}`)
      }
    }
    setIsModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  return (
    <>
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingUser(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input disabled={editingUser ? true : false} />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select
              placeholder="Select role"
              options={[
                { value: 'ADMIN', label: 'admin' },
                { value: 'USER', label: 'user' }
              ]}
            />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ModalUser
