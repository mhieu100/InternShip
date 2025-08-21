/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

interface IData {
  shelf: string
  totalOperationHours: number
  totalShortageHours: number
  shortageRate: number
}

const GroupChart = () => {
  const ref = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return

    const container = d3.select(ref.current)
    container.selectAll('*').remove()

    const width = 800
    const height = 400
    const marginTop = 40
    const marginRight = 80
    const marginBottom = 60
    const marginLeft = 80

    const svg = container
      .append('svg')
      .attr('width', width + marginLeft + marginRight)
      .attr('height', height + marginTop + marginBottom)
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
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')

    // Left Y axis (Hours)
    svg.append('g')
      .call(d3.axisLeft(yLeft))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')

    // Left Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - marginLeft)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Hours (H)')

    // Right Y axis (Percentage)
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yRight))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')

    // Right Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + marginRight - 20)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Rate (%)')

    // Sub-scale for grouped bars
    const xSubgroup = d3.scaleBand()
      .domain(['totalOperationHours', 'totalShortageHours'])
      .range([0, x.bandwidth()])
      .padding(0.1)

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
      .attr('stroke-width', 3)
      .attr('d', line)

    // Add dots for shortage rate
    svg.selectAll('.shortage-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'shortage-dot')
      .attr('cx', d => x(d.shelf)! + x.bandwidth() / 2)
      .attr('cy', d => yRight(d.shortageRate))
      .attr('r', 5)
      .attr('fill', '#ff7f0e')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add value labels on bars
    barGroups.selectAll('.bar-label')
      .data(d => [
        { key: 'totalOperationHours', value: d.totalOperationHours, x: (xSubgroup('totalOperationHours') || 0) + xSubgroup.bandwidth() / 2 },
        { key: 'totalShortageHours', value: d.totalShortageHours, x: (xSubgroup('totalShortageHours') || 0) + xSubgroup.bandwidth() / 2 }
      ])
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => d.x)
      .attr('y', d => yLeft(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-family', 'sans-serif')
      .style('fill', '#333')
      .text(d => d.value)

    // Add shortage rate labels
    svg.selectAll('.rate-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'rate-label')
      .attr('x', d => x(d.shelf)! + x.bandwidth() / 2)
      .attr('y', d => yRight(d.shortageRate) - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-family', 'sans-serif')
      .style('fill', '#ff7f0e')
      .style('font-weight', 'bold')
      .text(d => `${d.shortageRate}%`)

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 200}, 20)`)

    const legendItems = [
      { label: 'Operation Hours', color: color('totalOperationHours') || '#4e79a7', type: 'rect' },
      { label: 'Shortage Hours', color: color('totalShortageHours') || '#e15759', type: 'rect' },
      { label: 'Shortage Rate', color: '#ff7f0e', type: 'line' }
    ]

    const legendItem = legend.selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItem.each(function(d) {
      const item = d3.select(this)
      
      if (d.type === 'rect') {
        item.append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', d.color)
          .attr('opacity', 0.8)
      } else {
        item.append('line')
          .attr('x1', 0)
          .attr('x2', 15)
          .attr('y1', 7.5)
          .attr('y2', 7.5)
          .attr('stroke', d.color)
          .attr('stroke-width', 3)
        
        item.append('circle')
          .attr('cx', 7.5)
          .attr('cy', 7.5)
          .attr('r', 3)
          .attr('fill', d.color)
      }
      
      item.append('text')
        .attr('x', 20)
        .attr('y', 7.5)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-family', 'sans-serif')
        .text(d.label)
    })

    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .text('Shelf Performance Analysis')

  }, [data])

  return (
    <div
      ref={ref}
      style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}
    />
  )
}

export default GroupChart
