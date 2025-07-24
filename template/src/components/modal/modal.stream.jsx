import { Modal, Space, Button, Select, Spin, message } from "antd";
import HLSPlayer from "../../pages/video";
import { callGetStreamUrl } from "../../service/api";

const ModalStream = ({
  streamModalVisible,
  streamLoading,
  streamReady,
  camera,
  cameras,
  streamQuality,
  setStreamQuality,
  streamStatus,
  stopCameraStream,
  setStreamModalVisible,
  getStatusTag,
  startCameraStream,
  setStreamLoading,
}) => {
  const renderStreamQualitySelector = () => (
    <Select
      value={streamQuality}
      onChange={async (value) => {
        setStreamQuality(value);
        if (camera) {
          setStreamLoading(true);
          try {
            await stopCameraStream();
            await startCameraStream(camera);
          } finally {
            setStreamLoading(false);
          }
        }
      }}
      style={{ width: 120 }}
      disabled={streamLoading}
    >
      <Select.Option value="low">Thấp (500kbps)</Select.Option>
      <Select.Option value="medium">Trung bình (1Mbps)</Select.Option>
      <Select.Option value="high">Cao (2Mbps)</Select.Option>
    </Select>
  );

  const renderStreamStats = () => {
    if (!streamStatus) return null;
    return (
      <div style={{ marginTop: 10, fontSize: "12px", color: "#666" }}>
        <p>Thời gian hoạt động: {Math.round(streamStatus.uptimeMs / 1000)}s</p>
        <p>Chất lượng: {streamStatus.quality}</p>
        <p>Trạng thái: {streamStatus.active ? "Đang phát" : "Dừng"}</p>
      </div>
    );
  };

  return (
    <Modal
      title="Camera Stream"
      open={streamModalVisible}
      onCancel={async () => {
        await stopCameraStream();
        setStreamModalVisible(false);
      }}
      width={800}
      key={camera}
      footer={[
        <Space key="space">
          <div key="quality-selector">{renderStreamQualitySelector()}</div>
          <Button
            key="disconnect"
            onClick={stopCameraStream}
            danger
            disabled={streamLoading}
          >
            Ngắt kết nối
          </Button>
          <Button
            key="close"
            onClick={() => {
              stopCameraStream();
              setStreamModalVisible(false);
            }}
            disabled={streamLoading}
          >
            Đóng
          </Button>
        </Space>,
      ]}
      destroyOnHidden={true}
      maskClosable={false}
    >
      {streamModalVisible && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 32,
          }}
        >
          {streamLoading || !streamReady ? (
            <div
              style={{
                width: "400px",
                height: "225px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
              }}
            >
              <Spin>
                <div style={{ padding: "20px", color: "white" }}>
                  {streamLoading
                    ? "Đang kết nối đến camera..."
                    : "Đang khởi tạo stream..."}
                </div>
              </Spin>
            </div>
          ) : (
            camera && (
              <HLSPlayer
                src={callGetStreamUrl(camera)}
                key={`${camera}-${streamQuality}`}
                quality={streamQuality}
                onError={() => {
                  message.error(
                    "Không thể kết nối đến camera. Vui lòng thử lại sau."
                  );
                  stopCameraStream();
                  setStreamModalVisible(false);
                }}
              />
            )
          )}
          {/* Camera info section */}
          {cameras &&
            cameras.length > 0 &&
            (() => {
              const cam = cameras.find((c) => c.id === camera);
              if (!cam) return null;
              return (
                <div style={{ minWidth: 220 }}>
                  <h3>Thông tin Camera</h3>
                  <p>
                    <b>Tên:</b> {cam.name}
                  </p>
                  <p>
                    <b>Địa chỉ IP:</b> {cam.ipAddress}
                  </p>
                  <p>
                    <b>Vị trí:</b> {cam.location}
                  </p>
                  <p>
                    <b>Độ phân giải:</b> {cam.resolution}
                  </p>
                  <p>
                    <b>FPS:</b> {cam.fps}
                  </p>
                  <p>
                    <b>Trạng thái:</b> {getStatusTag(cam.status)}
                  </p>
                  <p>
                    <b>Chất lượng stream:</b> {streamQuality}
                  </p>
                  {renderStreamStats()}
                </div>
              );
            })()}
        </div>
      )}
    </Modal>
  );
};

export default ModalStream; 