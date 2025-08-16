// import { Card, Col, Row, Space, Typography } from 'antd'
// import ShelfFilter from 'components/filters/ShelfFilter'
// import TimeFilter from 'components/filters/TimeFilter'
// import ShelfTable from 'components/tables/ShelfTable'
// import { useEffect, useRef, useState } from 'react'
// import { Shelf } from 'types/backend'

// const { Title } = Typography

// const AnalysisShelf = () => {
//   const wsRef = useRef<WebSocket | null>(null)
//   const isMountedRef = useRef(true)
//   const [shelfs, setShelfs] = useState<Shelf[]>([])

//   // useEffect(() => {
//   //   // Tạo sẵn toàn bộ các mốc thời gian
//   //   const timeSlots = []
//   //   const startHour = 7
//   //   const endHour = 17

//   //   for (let hour = startHour; hour <= endHour; hour++) {
//   //     for (let minute of [0, 15, 30, 45]) {
//   //       if (hour === endHour && minute > 0) break
//   //       timeSlots.push({
//   //         time: `${hour.toString().padStart(2, '0')}:${minute
//   //           .toString()
//   //           .padStart(2, '0')}`,
//   //         percentage: Math.floor(Math.random() * 100) + 1
//   //       })
//   //     }
//   //   }

//   //   let index = 0
//   //   const interval = setInterval(() => {
//   //     if (index < timeSlots.length) {
//   //       setData((prev) => [...prev, timeSlots[index]])
//   //       index++
//   //     } else {
//   //       clearInterval(interval)
//   //     }
//   //   }, 1000) // mỗi 1 giây thêm 1 giá trị

//   //   return () => clearInterval(interval)
//   // }, [])

//   useEffect(() => {
//     isMountedRef.current = true
//     connectWebSocket()

//     return () => {
//       isMountedRef.current = false
//       disconnectWebSocket()
//     }
//   }, [])

//   const connectWebSocket = () => {
//     if (wsRef.current) {
//       disconnectWebSocket()
//     }
//     wsRef.current = new WebSocket('ws://localhost:8083/data-stream')

//     wsRef.current.onopen = () => {
//       console.log('WebSocket connection established')
//     }
//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data)
//       // if (Array.isArray(data)) {
//       //   setShelfs((prevShelf) => {
//       //     const updateShelfMap = new Map(
//       //       data.map((shelf) => [shelf.shelveId, shelf])
//       //     )
//       //   })
//       // }
//       setShelfs(data)
//     }
//     wsRef.current.onclose = () => {
//       console.log('WebSocket connection closed')
//     }
//     wsRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error)
//     }
//   }

//   const disconnectWebSocket = () => {
//     if (wsRef.current) {
//       wsRef.current.close()
//       wsRef.current = null
//     }
//   }
//   console.log(shelfs)

//   return (
//     <div className="p-6">
//       {/* Header Section */}
//       <div className="mb-6 flex items-center justify-between">
//         <Space>
//           <Title level={2} className="!mb-0">
//             Real-time Shelf Monitoring
//           </Title>
//         </Space>
//       </div>

//       {/* Toolbar Section */}
//       <Row gutter={[16, 16]} className="mb-6">
//         <Col>
//           <ShelfFilter onSearch={(value) => console.log('Search:', value)} />
//         </Col>
//         <Col>
//           <TimeFilter onChange={(dates) => console.log('Time range:', dates)} />
//         </Col>
//       </Row>

//       {/* Charts Section */}
//       {/* <Row gutter={[16, 16]} className="mb-6">
//         <Col span={24}>
//           <Card title="OSA Performance">
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart
//                 data={data}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="time" />
//                 <YAxis
//                   domain={[0, 100]}
//                   tickFormatter={(value) => `${value}%`}
//                 />
//                 <Tooltip formatter={(value) => `${value}%`} />
//                 <Bar dataKey="percentage" fill="#1890ff" />
//                 <ReferenceLine
//                   y={40}
//                   stroke="red"
//                   strokeDasharray="3 3"
//                   label="Threshold 40%"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row> */}

//       {/* Detailed Table Section */}
//       <Row>
//         <Col span={24}>
//           <Card title="Shelf Details">
//             <ShelfTable shelfs={shelfs} />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   )
// }

// export default AnalysisShelf

import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

const AnalysisShelf = () => {
  const myElementRef = useRef(null)

  const [barData, setBarData] = useState([10, 20, 40, 30, 10])
  const rectWidth = 50
  const totalHeight = 100

  useEffect(() => {
    const svg = d3.select(myElementRef.current)

    const allRectData = svg
      .sellectAll('rect')
      .data(barData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * rectWidth)
      .attr('y', (d, i) => 100 - d)
      .attr('height', (d) => d)
      .attr('width', rectWidth)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5 5')
      .attr('stroke', '#8372A6')
      .attr('fill', 'pink')
  })

  return (
    <div>
      <h3>E07 att style</h3>
      <svg
        ref={myElementRef}
        width={rectWidth * barData?.length}
        height={50}
        style={{ border: '1px dashed' }}
      ></svg>
    </div>
  )
}
export default AnalysisShelf
