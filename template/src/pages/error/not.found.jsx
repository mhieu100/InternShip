import { Button, Card, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NoFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Card variant="borderless" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Result
        status="404"
        title="404"
        subTitle={"Không Tìm Thấy Trang Này"}
        extra={<Button type="primary" onClick={() => navigate(-1)}>Back</Button>}
      />
    </Card>
  );
};

export default NoFoundPage;
