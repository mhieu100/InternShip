/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, message, Space, Table, Upload } from 'antd'
import { useState } from 'react'
import Papa from 'papaparse'
import { UploadOutlined } from '@ant-design/icons'

const CSVUploadTable = () => {
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])

  // Process CSV file
  const processCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        if (results.data.length === 0) {
          message.error('CSV file is empty or invalid')
          return
        }

        // Process the data
        const processedData = results.data.map((row: any, index: any) => ({
          key: index,
          staffName: row.staffName || '',
          areaName: row.areaName || '',
          dateWork: row.dateWork || '',
          startTime: row.startTime || '',
          endTime: row.endTime || ''
        }))

        // Create columns for Ant Design table
        const tableColumns: any = [
          {
            title: 'Staff Name',
            dataIndex: 'staffName',
            key: 'staffName'
          },
          {
            title: 'Area Name',
            dataIndex: 'areaName',
            key: 'areaName'
          },
          {
            title: 'Date Work',
            dataIndex: 'dateWork',
            key: 'dateWork'
          },
          {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime'
          },
          {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime'
          }
        ]

        setColumns(tableColumns)
        setTableData(processedData)
        message.success(`Successfully loaded ${processedData.length} records`)
      },
      error: function (error: any) {
        message.error('Error parsing CSV file: ' + error.message)
      }
    })
  }

  // Custom upload props
  const uploadProps = {
    beforeUpload: (file: File) => {
      // Check if file is CSV
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')
      if (!isCSV) {
        message.error('You can only upload CSV files!')
        return Upload.LIST_IGNORE
      }

      processCSV(file)
      return false // Prevent automatic upload
    },
    showUploadList: false,
    accept: '.csv'
  }

  // Clear table data
  const clearData = () => {
    setTableData([])
    setColumns([])
    message.info('Table data cleared')
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="CSV File Upload" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} type="primary">
              Upload CSV File
            </Button>
          </Upload>

          {tableData.length > 0 && (
            <Button onClick={clearData} danger>
              Clear Data
            </Button>
          )}
        </Space>

        <div style={{ marginTop: 16 }}>
          <p>Expected CSV format:</p>
          <code
            style={{ background: '#f5f5f5', padding: '8px', display: 'block' }}
          >
            staffName,areaName,dateWork,startTime,endTime
          </code>
        </div>
      </Card>

      {tableData.length > 0 && (
        <Card title="Staff Work Schedule">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
            }}
            scroll={{ x: true }}
            bordered
          />
        </Card>
      )}
    </div>
  )
}

export default CSVUploadTable
