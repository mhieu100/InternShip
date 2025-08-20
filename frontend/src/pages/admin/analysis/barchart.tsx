import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { BAR_CHART_CONFIG } from 'utils/chart.config'

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
  config?: Partial<typeof BAR_CHART_CONFIG>
}

const Barchart = (props: IProps) => {
  const { groupData, config: customConfig } = props
  const ref = useRef<HTMLDivElement>(null)

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  }

  // Merge config mặc định với config custom (nếu có)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = {
    ...BAR_CHART_CONFIG,
    ...customConfig,
    dimensions: {
      ...BAR_CHART_CONFIG.dimensions,
      ...(customConfig?.dimensions || {})
    },
    bars: {
      ...BAR_CHART_CONFIG.bars,
      ...(customConfig?.bars || {})
    }
  }

  useEffect(() => {
    if (!groupData || groupData.length === 0 || !ref.current) return

    // Clear previous chart
    const container = d3.select(ref.current)
    container.selectAll('*').remove()

    // Lấy dữ liệu shelf
    const shelfData = groupData[0].data
    const shelveName = groupData[0].shelveName

    // Tính toán kích thước thực tế
    const width = ref.current.clientWidth || config.dimensions.width
    const innerWidth =
      width - config.dimensions.margin.left - config.dimensions.margin.right
    const innerHeight =
      config.dimensions.height -
      config.dimensions.margin.top -
      config.dimensions.margin.bottom

    // Create SVG
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', config.dimensions.height)
      .append('g')
      .attr(
        'transform',
        `translate(${config.dimensions.margin.left},${config.dimensions.margin.top})`
      )


    // X axis - time points
    const x = d3
      .scaleBand()
      .domain(shelfData.map((d) => d.time))
      .range([0, innerWidth])
      .padding(config.bars.padding)

    // Y axis - osaRate
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(shelfData, (d) => d.osaRate) || 100])
      .nice()
      .range([innerHeight, 0])

    // Lấy màu sắc từ config, fallback về màu default
    const color =
      config.bars.colors[shelveName as keyof typeof config.bars.colors] ||
      config.bars.colors.default

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat((d) => formatTime(d as string)))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y))

    // Add Y axis label (osaRate title)
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - config.dimensions.margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#333')
      .text('OSA Rate (%)')

    // Add bars
    svg
      .selectAll('.bar')
      .data(shelfData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.time) || 0)
      .attr('y', (d) => y(d.osaRate))
      .attr('width', x.bandwidth())
      .attr('height', (d) => innerHeight - y(d.osaRate))
      .attr('fill', color)
      .attr('rx', config.bars.borderRadius)
      .attr('ry', config.bars.borderRadius)

    // Add value labels
    svg
      .selectAll('.text-value')
      .data(shelfData)
      .enter()
      .append('text')
      .attr('class', 'text-value')
      .attr('x', (d) => (x(d.time) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.osaRate) - config.labels.offset)
      .attr('text-anchor', 'middle')
      .text((d) => d.osaRate)
      .style('font-size', `${config.labels.fontSize}px`)
      .style('fill', config.labels.color)

    // Add chart title
    svg
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -config.title.offset)
      .attr('text-anchor', 'middle')
      .style('font-size', `${config.title.fontSize}px`)
      .text(`OSA Rate - ${shelveName}`)
  }, [groupData, ref.current?.clientWidth, config])

  return <div ref={ref} style={{ width: '100%' }} />
}

export default Barchart
