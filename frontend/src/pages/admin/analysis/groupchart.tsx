/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

interface IData {
  shelf: string
  totalOperationHours: number
  totalShortageHours: number
  shortageRate: number
}

const GroupChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })

  const data: IData[] = [
    {
      shelf: 'Shelf 1',
      totalOperationHours: 50,
      totalShortageHours: 20,
      shortageRate: 40
    },
    {
      shelf: 'Shelf 2',
      totalOperationHours: 70,
      totalShortageHours: 18,
      shortageRate: 50
    },
    {
      shelf: 'Shelf 3',
      totalOperationHours: 60,
      totalShortageHours: 18,
      shortageRate: 25
    },
    {
      shelf: 'Shelf 4',
      totalOperationHours: 40,
      totalShortageHours: 18,
      shortageRate: 30
    },
    {
      shelf: 'Shelf 5',
      totalOperationHours: 60,
      totalShortageHours: 18,
      shortageRate: 50
    },
    {
      shelf: 'Shelf 6',
      totalOperationHours: 70,
      totalShortageHours: 18,
      shortageRate: 10
    }
  ]

  // Handle responsive sizing
  useEffect(() => {
    if (!ref.current) return

    const updateDimensions = () => {
      const containerWidth = ref.current?.clientWidth || 800
      const width = Math.max(300, containerWidth - 80) // Account for padding
      const height = Math.max(250, Math.min(600, width * 0.6)) // Better aspect ratio
      setDimensions({ width, height })
    }

    // Initial size
    updateDimensions()

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })

    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return

    const container = d3.select(ref.current)
    container.selectAll('*').remove()

    const { width, height } = dimensions
    const marginTop = Math.max(30, height * 0.08)
    const marginRight = Math.max(50, width * 0.1)
    const marginBottom = Math.max(40, height * 0.1)
    const marginLeft = Math.max(50, width * 0.1)

    const svgWidth = width + marginLeft + marginRight
    const svgHeight = height + marginTop + marginBottom

    const svg = container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('max-width', '100%')
      .style('height', 'auto')
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`)

    // X scale for shelves
    const x = d3.scaleBand()
      .domain(data.map(d => d.shelf))
      .range([0, width])
      .padding(0.3)

    // Left Y scale for hours
    const yLeft = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.totalOperationHours, d.totalShortageHours)) || 0])
      .range([height, 0])

    // Right Y scale for percentage
    const yRight = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0])

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', `${Math.max(10, width * 0.015)}px`)
      .style('font-family', 'sans-serif')

    // Left Y axis (Hours)
    svg.append('g')
      .call(d3.axisLeft(yLeft))
      .selectAll('text')
      .style('font-size', `${Math.max(10, width * 0.015)}px`)
      .style('font-family', 'sans-serif')

    // Left Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - marginLeft + 15)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', `${Math.max(11, width * 0.016)}px`)
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Hours (H)')

    // Right Y axis (Percentage)
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yRight))
      .selectAll('text')
      .style('font-size', `${Math.max(10, width * 0.015)}px`)
      .style('font-family', 'sans-serif')

    // Right Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + marginRight - 15)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', `${Math.max(11, width * 0.016)}px`)
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Rate (%)')

    // Sub-scale for grouped bars
    const xSubgroup = d3.scaleBand()
      .domain(['totalOperationHours', 'totalShortageHours'])
      .range([0, x.bandwidth()])
      .padding(width < 500 ? 0.05 : 0.1)

    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(['totalOperationHours', 'totalShortageHours'])
      .range(['#4e79a7', '#e15759'])

    // Create grouped bars
    const barGroups = svg.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(${x(d.shelf)},0)`)

    // Operation hours bars
    barGroups.append('rect')
      .attr('x', xSubgroup('totalOperationHours') || 0)
      .attr('y', d => yLeft(d.totalOperationHours))
      .attr('width', xSubgroup.bandwidth())
      .attr('height', d => height - yLeft(d.totalOperationHours))
      .attr('fill', color('totalOperationHours') || '#4e79a7')
      .attr('opacity', 0.8)

    // Shortage hours bars
    barGroups.append('rect')
      .attr('x', xSubgroup('totalShortageHours') || 0)
      .attr('y', d => yLeft(d.totalShortageHours))
      .attr('width', xSubgroup.bandwidth())
      .attr('height', d => height - yLeft(d.totalShortageHours))
      .attr('fill', color('totalShortageHours') || '#e15759')
      .attr('opacity', 0.8)

    // Line generator for shortage rate
    const line = d3.line<IData>()
      .x(d => x(d.shelf)! + x.bandwidth() / 2)
      .y(d => yRight(d.shortageRate))
      .curve(d3.curveMonotoneX)

    // Add shortage rate line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff7f0e')
      .attr('stroke-width', Math.max(2, width * 0.004))
      .attr('d', line)

    // Add dots for shortage rate
    svg.selectAll('.shortage-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'shortage-dot')
      .attr('cx', d => x(d.shelf)! + x.bandwidth() / 2)
      .attr('cy', d => yRight(d.shortageRate))
      .attr('r', Math.max(3, width * 0.006))
      .attr('fill', '#ff7f0e')
      .attr('stroke', '#fff')
      .attr('stroke-width', Math.max(1, width * 0.002))

    // Add value labels on bars (only show if width is sufficient)
    if (width > 500) {
      barGroups.selectAll('.bar-label')
        .data(d => [
          { key: 'totalOperationHours', value: d.totalOperationHours, x: (xSubgroup('totalOperationHours') || 0) + xSubgroup.bandwidth() / 2 },
          { key: 'totalShortageHours', value: d.totalShortageHours, x: (xSubgroup('totalShortageHours') || 0) + xSubgroup.bandwidth() / 2 }
        ])
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => d.x)
        .attr('y', d => yLeft(d.value) - Math.max(3, height * 0.01))
        .attr('text-anchor', 'middle')
        .style('font-size', `${Math.max(8, width * 0.014)}px`)
        .style('font-family', 'sans-serif')
        .style('fill', '#333')
        .text(d => d.value)
    }

    // Add shortage rate labels (only show if width is sufficient)
    if (width > 400) {
      svg.selectAll('.rate-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'rate-label')
        .attr('x', d => x(d.shelf)! + x.bandwidth() / 2)
        .attr('y', d => yRight(d.shortageRate) - Math.max(8, height * 0.02))
        .attr('text-anchor', 'middle')
        .style('font-size', `${Math.max(8, width * 0.014)}px`)
        .style('font-family', 'sans-serif')
        .style('fill', '#ff7f0e')
        .style('font-weight', 'bold')
        .text(d => `${d.shortageRate}%`)
    }

    // Add legend (only show if width is sufficient)
    if (width > 450) {
      const legendWidth = Math.min(180, width * 0.3)
      const legendX = width > 600 ? width - legendWidth : 10
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX}, 20)`)

      const legendItems = [
        { label: 'Operation Hours', color: color('totalOperationHours') || '#4e79a7', type: 'rect' },
        { label: 'Shortage Hours', color: color('totalShortageHours') || '#e15759', type: 'rect' },
        { label: 'Shortage Rate', color: '#ff7f0e', type: 'line' }
      ]

      const legendItemHeight = Math.max(14, height * 0.05)
      const legendIconSize = Math.max(10, width * 0.015)
      
      const legendItem = legend.selectAll('.legend-item')
        .data(legendItems)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * legendItemHeight})`)

      legendItem.each(function(d) {
        const item = d3.select(this)
        
        if (d.type === 'rect') {
          item.append('rect')
            .attr('width', legendIconSize)
            .attr('height', legendIconSize)
            .attr('fill', d.color)
            .attr('opacity', 0.8)
        } else {
          item.append('line')
            .attr('x1', 0)
            .attr('x2', legendIconSize)
            .attr('y1', legendIconSize / 2)
            .attr('y2', legendIconSize / 2)
            .attr('stroke', d.color)
            .attr('stroke-width', Math.max(2, width * 0.003))
          
          item.append('circle')
            .attr('cx', legendIconSize / 2)
            .attr('cy', legendIconSize / 2)
            .attr('r', Math.max(2, width * 0.004))
            .attr('fill', d.color)
        }
        
        item.append('text')
          .attr('x', legendIconSize + 5)
          .attr('y', legendIconSize / 2)
          .attr('dy', '0.35em')
          .style('font-size', `${Math.max(9, width * 0.016)}px`)
          .style('font-family', 'sans-serif')
          .text(d.label)
      })
    }

    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', `${Math.max(12, width * 0.02)}px`)
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .text('Shelf Performance Analysis')

  }, [data, dimensions])

  return (
    <div
      ref={ref}
      style={{ 
        width: '100%', 
        height: `${dimensions.height + 100}px`,
        minHeight: '350px',
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    />
  )
}

export default GroupChart
