import React, { useState, useEffect } from 'react';
import { Modal, Table, Tag } from 'antd';
import moment from 'moment';
import { callGetHealthCheck } from '../../../services/api';

const CameraHistoryModal = ({ modalVisible, setModalVisible }) => {
    const [historyCheck, setHistoryCheck] = useState(null);

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handelHistoryCheck = async () => {
        const response = await callGetHealthCheck();
        setHistoryCheck(response.data);
    };

    useEffect(() => {
        if (modalVisible) {
            handelHistoryCheck();
        }
    }, [modalVisible]);

    const columns = [
        {
            title: 'Camera Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'ONLINE' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Ping (ms)',
            dataIndex: 'ping',
            key: 'ping',
            render: (ping) => (ping === -1 ? 'N/A' : ping),
        },
        {
            title: 'Checked At',
            dataIndex: 'checkedAt',
            key: 'checkedAt',
            render: (timestamp) => moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];

    return (
        <Modal
            title="Camera History"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={modalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
        >
            <Table
                columns={columns}
                dataSource={historyCheck}
                rowKey={(record, index) => index}
                pagination={{ pageSize: 5 }}
                loading={!historyCheck}
            />
        </Modal>
    );
};

export default CameraHistoryModal;