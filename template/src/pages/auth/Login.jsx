import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { callLogin } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { useEffect } from "react";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuthentication);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  const onFinish = async (values) => {
    try {
      const res = await callLogin(values.email, values.password);
    if (res && res.statusCode === 200) {
      message.success("Đăng nhập thành công");
      console.log(res.data)
      dispatch(setUser(res.data.user));
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/");
    } else {
      console.log(res);
      message.error("Tài khoản mật khẩu không đúng");
    }
    } catch (error) {
      message.error("Server disconnect !")
    }
    
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Card style={{ width: 350 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng nhập
        </Title>
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="link" block onClick={() => navigate("/register")}>
              Chưa có tài khoản? Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
