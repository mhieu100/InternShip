import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { callDemoData } from 'services/test'
import { IMetric } from 'types/backend'

const Demo2 = () => {
  const myElementRef = useRef(null)
  const yAxisRef = useRef(null)

  interface GroupedData {
    [key: string]: Array<{ time: string; osaRate: number }>
  }

  const [data, setData] = useState<IMetric[]>([])

  useEffect(() => {
    const callData = async () => {
      const response = await callDemoData()
      if (response?.data) {
        setData(response.data)
      }
    }
    callData()
  }, [])

  function regroupForChart(data: IMetric[]) {
    const grouped = data.reduce((acc: GroupedData, item: IMetric) => {
      if (!acc[item.shelveName]) {
        acc[item.shelveName] = []
      }
      acc[item.shelveName].push({ time: item.time, osaRate: item.osaRate })
      return acc
    }, {} as GroupedData)

    return Object.keys(grouped).map((key) => ({
      shelveName: key,
      data: grouped[key].sort((a, b) => a.time.localeCompare(b.time))
    }))
  }

  // Move groupData calculation inside useEffect or use useMemo
  const groupData = regroupForChart(data)
  const barData = groupData[0]?.data || [] // Changed from index 1 to 0

  // Calculate dimensions
  const height = 400
  const rectWidth = 50
  const barSpacing = 30

  const theme = {
    primary: '#1677ff',
    primaryLight: '#e6f4ff',
    text: '#000000e0',
    grid: '#f5f5f5'
  }

  const margin = {
    top: 40,
    right: 60,
    bottom: 30,
    left: 60
  }

  const width =
    barData.length * (rectWidth + barSpacing) + margin.left + margin.right
  const maxAge = d3.max(barData, (d) => d.osaRate) || 100 // Added fallback value

  useEffect(() => {
    d3.select('.d3-tooltip').remove()

    d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('padding', '6px 12px')
      .style('border-radius', '4px')
      .style('font-size', '14px')
      .style('box-shadow', '0 3px 6px -4px rgba(0, 0, 0, 0.12)')
      .style('border', '1px solid rgba(0, 0, 0, 0.06)')
  }, [])

  // Create scales
  const yScale = d3
    .scaleLinear()
    .domain([0, maxAge + maxAge * 0.1])
    .range([height, 0]) // Added range - this was missing!

  useEffect(() => {
    if (!myElementRef.current || !yAxisRef.current || barData.length === 0)
      return

    // Don't reverse data - show in original order
    const chartData = [...barData]

    // Clear previous content
    const svg = d3.select(myElementRef.current)
    svg.selectAll('*').remove()

    const yAxisSvg = d3.select(yAxisRef.current)
    yAxisSvg.selectAll('*').remove()

    // Create Y axis in fixed container
    const yAxis = d3.axisLeft(yScale).ticks(10)

    yAxisSvg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left - 1}, ${margin.top})`)
      .call(yAxis)
      .call((g) => g.selectAll('.tick text').attr('fill', theme.text))
      .call((g) => g.select('.domain').remove())

    // Add Y axis label
    yAxisSvg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -(height + margin.top) / 2)
      .attr('text-anchor', 'middle')
      .text('OSA Rate')
      .attr('fill', theme.text)

    // Add horizontal grid lines in main chart area
    svg
      .selectAll('.grid-line')
      .data(yScale.ticks(10))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width - margin.left - margin.right)
      .attr('y1', (d) => margin.top + yScale(d))
      .attr('y2', (d) => margin.top + yScale(d))
      .attr('stroke', theme.grid)
      .attr('stroke-opacity', 0.5)

    // Add bars
    svg
      .selectAll('rect')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (rectWidth + barSpacing))
      .attr('y', (d) => margin.top + yScale(d.osaRate))
      .attr('height', (d) => height - yScale(d.osaRate))
      .attr('width', rectWidth)
      .attr('stroke-width', 2)
      .attr('stroke', theme.primary)
      .attr('fill', theme.primaryLight)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('.d3-tooltip')
        tooltip
          .html(
            `<div>
              <div style="font-weight: 600; color: ${theme.text}">Time: ${d.time}</div>
              <div style="color: ${theme.primary}">OSA Rate: ${d.osaRate}</div>
             </div>`
          )
          .style('visibility', 'visible')
      })
      .on('mousemove', (event) => {
        const tooltip = d3.select('.d3-tooltip')
        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px')
      })
      .on('mouseout', () => {
        d3.select('.d3-tooltip').style('visibility', 'hidden')
      })

    // Add value labels on top of bars
    svg
      .selectAll('.value-label')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .text((d) => d.osaRate)
      .attr('x', (d, i) => i * (rectWidth + barSpacing) + rectWidth / 2)
      .attr('y', (d) => margin.top + yScale(d.osaRate) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.primary)
      .attr('font-weight', 'bold')

    // Add time labels at bottom
    svg
      .selectAll('.time-label')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'time-label')
      .text((d) => d.time)
      .attr('x', (d, i) => i * (rectWidth + barSpacing) + rectWidth / 2)
      .attr('y', margin.top + height + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.text)
      .attr('font-size', '12px')
  }, [data, barData, maxAge, yScale]) // Added dependencies

  return (
    <div>
      <h3>Bar Graph with D3</h3>
      <div>Data points: {barData.length}</div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '800px',
          border: `1px solid ${theme.grid}`,
          borderRadius: '4px',
          background: '#fff'
        }}
      >
        {/* Fixed Y-axis container */}
        <div
          style={{
            flex: '0 0 auto',
            width: `${margin.left}px`,
            borderRight: `1px solid ${theme.grid}`
          }}
        >
          <svg
            ref={yAxisRef}
            width={margin.left}
            height={height + margin.top + margin.bottom}
            style={{
              display: 'block',
              background: '#fff'
            }}
          ></svg>
        </div>

        {/* Scrollable chart area */}
        <div
          style={{
            flex: '1 1 auto',
            overflowX: 'auto',
            overflowY: 'hidden'
          }}
        >
          <svg
            ref={myElementRef}
            width={Math.max(
              600,
              barData.length * (rectWidth + barSpacing) + 50
            )}
            height={height + margin.top + margin.bottom}
            style={{
              display: 'block',
              background: '#fff'
            }}
          ></svg>
        </div>
      </div>
    </div>
  )
}

export default Demo2

// import React, { useEffect, useState } from 'react'
// import { callDemoData } from 'services/test'
// import { IMetric } from 'types/backend'
// import Barchart from './barchart'

// const Demo2 = () => {
//   const [data, setData] = useState<IMetric[]>([])
//   const groupData = regroupForChart(data)
//   useEffect(() => {
//     const callData = async () => {
//       const response = await callDemoData()
//       setData(response.data)
//     }
//     callData()
//   }, [])

//   function regroupForChart(data: IMetric[]) {
//     const grouped = data.reduce((acc: any, item: any) => {
//       if (!acc[item.shelveName]) {
//         acc[item.shelveName] = []
//       }
//       acc[item.shelveName].push({ time: item.time, osaRate: item.osaRate })
//       return acc
//     }, {})

//     return Object.keys(grouped).map((key) => ({
//       shelveName: key,
//       data: grouped[key].sort((a, b) => a.time.localeCompare(b.time))
//     }))
//   }
//   return (
//     <>
//       <Barchart groupData={groupData} />
//     </>
//   )
// }

// export default Demo2
