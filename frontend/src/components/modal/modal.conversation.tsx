import { UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Radio, Select, Space } from 'antd'

const { Option } = Select
import { useState } from 'react'
import { FormInstance } from 'antd/lib'
import { IConversation, IUser } from 'types/backend'
import { callCreateGroupChat, callCreateSingleChat } from 'services/chat.api'

interface IProps {
  form: FormInstance
  open: boolean
  setOpen: (open: boolean) => void
  availableUsers: IUser[]
  setSelectConver: (selectConver: IConversation) => void
  fetchConvers: () => void
}

const ModalConversation = (props: IProps) => {
  const { open, setOpen, availableUsers, form, setSelectConver, fetchConvers } =
    props
  const [conversationType, setConversationType] = useState('DIRECT')
  const [groupName, setGroupName] = useState('')

  const handleCreateConversation = async (values: {
    type: string
    groupName: string
    users: number[]
  }) => {
    if (values.type === 'DIRECT') {
      const response = await callCreateSingleChat(Number(values.users))
      if (response && response.data) {
        message.success('Direct create success')
        setSelectConver(response.data)
      } else {
        message.error('Conversation exists!')
      }
    } else {
      const response = await callCreateGroupChat(values.groupName, values.users)
      if (response && response.statusCode === 201) {
        message.success('Group create success')
        setSelectConver(response.data)
      }
    }
    fetchConvers()
    setOpen(false)
    form.resetFields()
  }

  return (
    <>
      <Modal
        title="Tạo cuộc trò chuyện mới"
        open={open}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateConversation}
          initialValues={{ type: 'DIRECT' }}
        >
          <Form.Item name="type" label="Loại cuộc trò chuyện">
            <Radio.Group
              onChange={(e) => setConversationType(e.target.value)}
              value={conversationType}
            >
              <Radio value="DIRECT">Cá nhân</Radio>
              <Radio value="GROUP">Nhóm</Radio>
            </Radio.Group>
          </Form.Item>

          {conversationType === 'GROUP' && (
            <Form.Item
              name="groupName"
              label="Tên nhóm"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}
            >
              <Input
                placeholder="Nhập tên nhóm"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Form.Item>
          )}

          <Form.Item
            name="users"
            label="Chọn thành viên"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ít nhất một thành viên'
              }
            ]}
          >
            <Select
              mode={conversationType === 'GROUP' ? 'multiple' : undefined}
              style={{ width: '100%' }}
              placeholder="Chọn thành viên"
              showSearch
              optionFilterProp="children"
            >
              {availableUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  <Space>
                    {/* <Avatar src={user.avatar} size="small" /> */}
                    {user.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setOpen(false)
                  form.resetFields()
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={
                  conversationType === 'GROUP' ? (
                    <UsergroupAddOutlined />
                  ) : (
                    <UserOutlined />
                  )
                }
              >
                Tạo {conversationType === 'GROUP' ? 'nhóm' : 'cuộc trò chuyện'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModalConversation
