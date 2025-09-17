/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Upload, Table, Button, message, Card, Row, Col } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import Papa from 'papaparse'
import { IData, IStaff } from 'types/backend'

const { Dragger } = Upload

type FormProps = {
  setData:
    | ((item: IData) => void)
    | React.Dispatch<React.SetStateAction<IData[]>>
}

const CSVUploadWithDragDrop = ({ setData }: FormProps) => {
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])

  const processCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.data.length === 0) {
          message.error('CSV file is empty or invalid')
          return
        }

        const processedData = results.data.map((row: any, index: any) => ({
          key: index,
          staffName: row.staffName || '',
          areaName: row.areaName || '',
          dateWork: row.dateWork || '',
          startTime: row.startTime || '',
          endTime: row.endTime || ''
        }))

        const tableColumns: any = [
          {
            title: 'Staff Name',
            dataIndex: 'staffName',
            key: 'staffName',
            fixed: 'left'
          },
          { title: 'Area Name', dataIndex: 'areaName', key: 'areaName' },
          { title: 'Date Work', dataIndex: 'dateWork', key: 'dateWork' },
          { title: 'Start Time', dataIndex: 'startTime', key: 'startTime' },
          { title: 'End Time', dataIndex: 'endTime', key: 'endTime' }
        ]

        setColumns(tableColumns)
        setTableData(processedData)
        const transformedData: IData[] = transformData(results.data)
        setData(transformedData)
        message.success(`Loaded ${processedData.length} records`)
      },
      error: (error) => {
        message.error('Error parsing CSV: ' + error.message)
      }
    })
  }

  const transformData = (data: any[]): IData[] => {
    const dateMap = new Map<string, IStaff[]>()

    data.forEach((item) => {
      const date = item.dateWork
      if (!dateMap.has(date)) {
        dateMap.set(date, [])
      }

      const staff: IStaff = {
        staffName: item.staffName,
        areaName: item.areaName,
        startTime: item.startTime,
        endTime: item.endTime
      }

      dateMap.get(date)?.push(staff)
    })

    // Convert map to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, shifts]) => ({ date, shifts }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: (file: File) => {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')
      if (!isCSV) {
        message.error('Only CSV files are allowed!')
        return Upload.LIST_IGNORE
      }
      processCSV(file)
      return false
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Upload CSV File">
            <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag CSV file to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single upload. Only CSV files with columns:
                staffName, areaName, dateWork, startTime, endTime
              </p>
            </Dragger>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          {tableData.length > 0 && (
            <Card
              title={`Staff Data (${tableData.length} records)`}
              extra={
                <Button onClick={() => setTableData([])} danger size="small">
                  Clear
                </Button>
              }
            >
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={{ pageSize: 5 }}
                size="small"
                scroll={{ x: 500 }}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default CSVUploadWithDragDrop
