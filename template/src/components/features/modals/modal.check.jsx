import { message, Modal } from 'antd'
import { callSaveCheckCamera } from '../../../services/api';


const ModalCheckHealth = ({ modalCheck, setModalCheck, cameraData }) => {
    const handleOk = async () => {
        if (!cameraData) {
            message.warning('Không có dữ liệu camera để lưu');
            setModalCheck(false);
            return;
        }

        try {
            // Tạo dữ liệu cần lưu
            const historyData = {
                cameraId: cameraData.id,
                name: cameraData.name,
                status: cameraData.status,
                ping: cameraData.ping,
                lastChecked: cameraData.lastChecked,
            };

            await callSaveCheckCamera(historyData);
            message.success('Đã lưu thông tin kiểm tra vào lịch sử');
            setModalCheck(false);
        } catch (error) {
            console.error('Lỗi khi lưu lịch sử:', error);
            message.error('Lỗi khi lưu thông tin kiểm tra');
        }
    };

    return (
        <Modal
            title="Kiểm Tra Sức Khỏe Camera"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={modalCheck}
            onOk={handleOk}
            onCancel={() => setModalCheck(false)}
            okText="Lưu lại"
            cancelText="Đóng"
        >
            {cameraData ? (
                <div>
                    <p><strong>Tên:</strong> {cameraData.name}</p>
                    <p>
                        <strong>Trạng thái:</strong>{' '}
                        <span
                            style={{
                                color: cameraData.status === 'ONLINE' ? 'green' : 'red',
                                fontWeight: 'bold',
                            }}
                        >
                            {cameraData.status === 'ONLINE' ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động'}
                        </span>
                    </p>
                    <p>
                        <strong>Độ trễ (Ping):</strong>{' '}
                        <span
                            style={{
                                color:
                                    cameraData.ping < 1000
                                        ? 'green'
                                        : cameraData.ping <= 2000
                                            ? 'orange'
                                            : 'red',
                                fontWeight: 'bold',
                            }}
                        >
                            {cameraData.ping} ms{' '}
                            {cameraData.ping < 1000
                                ? '(Tốt)'
                                : cameraData.ping <= 2000
                                    ? '(Trung bình)'
                                    : '(Kém)'}
                        </span>
                    </p>
                    <p>
                        <strong>Lần kiểm tra cuối:</strong>{' '}
                        {new Date(cameraData.lastChecked * 1000).toLocaleString('vi-VN')}
                    </p>
                </div>
            ) : (
                <p>Không có dữ liệu</p>
            )}
        </Modal>
    )
}

export default ModalCheckHealth