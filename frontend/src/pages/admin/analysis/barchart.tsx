/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export interface IMetricData {
  time: string
  osaRate: number
}

export interface IGroupData {
  shelveName: string
  data: IMetricData[]
}

interface IProps {
  groupData: IGroupData[]
}

const Barchart = (props: IProps) => {
  const { groupData } = props
  const ref = useRef<HTMLDivElement>(null)

  // Chart configuration
  const config = {
    dimensions: {
      width: 1100,
      height: 280,
      margin: { top: 40, right: 30, bottom: 70, left: 60 }
    },
    bars: {
      padding: 0.2,
      color: '#1890ff'
    },
    threshold: {
      value: 50,
      color: '#ff4d4f',
      strokeWidth: 2,
      strokeDasharray: '5,5'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px'
    }
  }

  useEffect(() => {
    if (!groupData || groupData.length === 0 || !ref.current) return

    // Clear previous chart
    const container = d3.select(ref.current)
    container.selectAll('*').remove()

    // Get data
    const data = groupData[0].data
    const shelfName = groupData[0].shelveName

    // Dimensions
    const { width, height, margin } = config.dimensions
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create SVG
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.time))
      .range([0, innerWidth])
      .padding(config.bars.padding)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.osaRate) || 100])
      .nice()
      .range([innerHeight, 0])

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', config.tooltip.backgroundColor)
      .style('color', config.tooltip.color)
      .style('padding', config.tooltip.padding)
      .style('border-radius', config.tooltip.borderRadius)
      .style('font-size', config.tooltip.fontSize)
      .style('pointer-events', 'none')
      .style('z-index', '1000')

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')

    // Y Axis
    g.append('g').call(d3.axisLeft(yScale))

    // Y Axis Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('OSA Rate (%)')

    // Threshold Line
    const thresholdY = yScale(config.threshold.value)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', thresholdY)
      .attr('y2', thresholdY)
      .attr('stroke', config.threshold.color)
      .attr('stroke-width', config.threshold.strokeWidth)
      .attr('stroke-dasharray', config.threshold.strokeDasharray)

    // Threshold Label
    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', thresholdY - 5)
      .attr('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', config.threshold.color)
      .text(`Threshold: ${config.threshold.value}%`)

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.time) || 0)
      .attr('y', (d) => yScale(d.osaRate))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => innerHeight - yScale(d.osaRate))
      .attr('fill', config.bars.color)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr(
          'fill',
          d3.color(config.bars.color)?.darker(0.2)?.toString() ||
            config.bars.color
        )
        tooltip.style('visibility', 'visible').html(`
            <div><strong>${shelfName}</strong></div>
            <div>Time: ${d.time}</div>
            <div>OSA Rate: ${d.osaRate}%</div>
          `)
      })
      .on('mousemove', function (event) {
        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', config.bars.color)
        tooltip.style('visibility', 'hidden')
      })

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove()
    }
  }, [groupData, config])

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: config.dimensions.height }}
    />
  )
}

export default Barchart
