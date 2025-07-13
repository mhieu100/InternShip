import { Button, Card, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PermissionPage = () => {
  const navigate = useNavigate();

  return (
    <Card variant="borderless">
      <Result
        status="403"
        title="403"
        subTitle={"Chỉ Admin Truy Cập Vào Đây"}
        extra={<Button type="primary" onClick={() => navigate(-1)}>Back</Button>}
      />
    </Card>
  );
};

export default PermissionPage;
