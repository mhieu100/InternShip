import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { callRegister } from '../service/api';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuthentication);

  useEffect(() => {
    if (isAuth) {
        navigate('/');
    }
  }, [isAuth]);

  const onFinish = async (values) => {
  
    const res = await callRegister(values.name, values.email, values.password)
    console.log(res);
    if(res && res.statusCode == 201) {
      message.success("Đăng ký thành công!")
      navigate("/login");
    } else {
      console.log(res);
      message.error(`Email ${values.email} đã tồn tại!`)
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Card style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Đăng ký</Title>
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Vui lòng nhập name!' }]}> 
            <Input type="text" placeholder="Name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}> 
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item name="confirm" label="Nhập lại mật khẩu" dependencies={["password"]} rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}>
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Đăng ký</Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="link" block onClick={() => navigate('/login')}>Đã có tài khoản? Đăng nhập</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
