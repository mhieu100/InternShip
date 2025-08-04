import { Modal, Form, Input, Button, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { callUpdateProfile } from '../../../services/api';
import { setUser } from '../../../store/slices/authSlice';

const ModalProfile = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await callUpdateProfile(user.id, values.name, values.address);
            
            // Update Redux state with the new user data
            dispatch(setUser({
                ...user,
                name: values.name,
                address: values.address
            }));
            
            message.success('Cập nhật thông tin thành công');
            setIsModalOpen(false);
        } catch (error) {
            message.error('Không thể cập nhật thông tin: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Cập nhật thông tin cá nhân"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={user}
                onFinish={handleSubmit}
                className="mt-4"
            >
                <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                        { required: true, message: 'Vui lòng nhập họ tên' },
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                    ]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Nhập email" disabled />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                >
                    <Input.TextArea
                        placeholder="Nhập địa chỉ"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item className="mb-0 text-right">
                    <Button onClick={() => setIsModalOpen(false)} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalProfile