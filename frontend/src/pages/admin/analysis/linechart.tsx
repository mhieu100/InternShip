/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { IShortageRateTotal } from 'types/backend'

interface IProps {
  data: IShortageRateTotal[]
}

const LineChart = (props: IProps) => {
  const { data } = props
  const ref = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 500 })

  useEffect(() => {
    if (!ref.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        const height = Math.max(300, Math.min(600, width * 0.4)) // Responsive height
        setDimensions({ width: Math.max(400, width - 40), height })
      }
    })

    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return

    const container = d3.select(ref.current)
    container.selectAll('*').remove()

    const { width, height } = dimensions
    const marginTop = Math.max(20, height * 0.05)
    const marginRight = Math.max(30, width * 0.04)
    const marginBottom = Math.max(40, height * 0.08)
    const marginLeft = Math.max(50, width * 0.06)

    const chartPadding = Math.max(20, width * 0.03)

    const x = d3.scaleUtc(
      d3.extent(data, (d) => new Date(d.date)) as [Date, Date],
      [marginLeft + chartPadding, width - marginRight - chartPadding]
    )

    const y = d3.scaleLinear(
      [0, d3.max(data, (d) => d.shortageRate) ?? 0],
      [height - marginBottom, marginTop]
    )
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%, height: auto; height: intrinsic')

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.max(3, width / 150))
          .tickSizeOuter(0)
      )
      .selectAll('text')
      .style('font-size', `${Math.max(10, width * 0.012)}px`)
      .style('font-family', 'sans-serif')

    // Y axis
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(Math.max(4, height / 60)))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .selectAll('.tick text')
          .style('font-size', `${Math.max(10, width * 0.012)}px`)
          .style('font-family', 'sans-serif')
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .style('font-size', `${Math.max(12, width * 0.014)}px`)
          .style('font-weight', 'bold')
          .text('Rate (%)')
      )

    const lineBuilder = d3
      .line<IShortageRateTotal>()
      .x((data) => x(new Date(data.date)))
      .y((data) => y(data.shortageRate))

    const linePath = lineBuilder(data)

    // Line path
    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', Math.max(1.5, width * 0.002))
      .attr('d', linePath)

    // Add dots on data points
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(new Date(d.date)))
      .attr('cy', (d) => y(d.shortageRate))
      .attr('r', Math.max(3, width * 0.004))
      .attr('fill', 'steelblue')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add chart title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', marginTop / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', `${Math.max(14, width * 0.018)}px`)
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .text('Shortage Rate Trend Over Time')
  }, [data, dimensions])

  return <div ref={ref} style={{ width: '100%' }} />
}

export default LineChart
