import React from "react";
import { Card, Typography, Result } from "antd";

const { Title, Paragraph } = Typography;

const CameraControl = () => {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: 400 }}>
        <Result
          icon={<span role="img" aria-label="camera" style={{ fontSize: 48 }}>📷</span>}
          title="Tính năng Camera sẽ sớm ra mắt!"
          subTitle="Chức năng này đang được phát triển. Vui lòng quay lại sau."
        />
      </Card>
    </div>
  );
};

export default CameraControl;