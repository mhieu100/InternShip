/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { IShortageRateTotal, IRecoveryRateTotal } from 'types/backend'

interface IProps {
  data: IShortageRateTotal[] | IRecoveryRateTotal[]
  chartType?: 'shortage' | 'recovery'
}

const LineChart = (props: IProps) => {
  const { data, chartType } = props
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
    const marginBottom = Math.max(30, height * 0.08)
    const marginLeft = Math.max(50, width * 0.06)

    const innerWidth = width - marginLeft - marginRight
    // const innerHeight = height - marginTop - marginBottom

    const chartPadding = Math.max(20, width * 0.03)

    const dateExtent = d3.extent(
      data,
      (d: IShortageRateTotal | IRecoveryRateTotal) => new Date(d.date)
    )
    const x = d3.scaleUtc(
      [dateExtent[0] ?? new Date(), dateExtent[1] ?? new Date()],
      [marginLeft + chartPadding, width - marginRight - chartPadding]
    )

    let maxValue = 0

    if (data.length > 0) {
      if (chartType === 'recovery') {
        const recoveryData = data as IRecoveryRateTotal[]
        maxValue = Math.max(
          d3.max(recoveryData, (d) => d.recoveryRate) ?? 0,
          d3.max(recoveryData, (d) => d.threadHold) ?? 0
        )
      } else {
        const shortageData = data as IShortageRateTotal[]
        maxValue = d3.max(shortageData, (d) => d.shortageRate) ?? 0
      }
    }

    const y = d3.scaleLinear(
      [0, maxValue + 10],
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
          .ticks(Math.max(3, width / 100))
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

    // Create lines and dots based on data type
    if (data.length > 0 && chartType === 'recovery') {
      const recoveryData = data as IRecoveryRateTotal[]

      // Shortage Rate Line
      const shortageLineBuilder = d3
        .line<IRecoveryRateTotal>()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.recoveryRate))

      const shortageLinePath = shortageLineBuilder(recoveryData)

      const g = svg
        .append('g')
        .attr('transform', `translate(${marginLeft},${marginTop})`)

      const thresholdY = y(50)
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', thresholdY)
        .attr('y2', thresholdY)
        .attr('stroke', '#ff4d4f')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')

      // Threshold Label
      g.append('text')
        .attr('x', innerWidth - 5)
        .attr('y', thresholdY - 5)
        .attr('text-anchor', 'end')
        .style('font-size', '10px')
        .style('fill', '#ff4d4f')
        .text(`Threshold: 50%`)

      svg
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', Math.max(1.5, width * 0.002))
        .attr('d', shortageLinePath)

      // Thread Hold Line

      const threadHoldLineBuilder = d3
        .line<IRecoveryRateTotal>()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.targetRate))

      const threadHoldLinePath = threadHoldLineBuilder(recoveryData)

      svg
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', Math.max(1.5, width * 0.002))
        .attr('stroke-dasharray', '5,5')
        .attr('d', threadHoldLinePath)

      // Shortage Rate dots
      svg
        .selectAll('.dot-shortage')
        .data(recoveryData)
        .enter()
        .append('circle')
        .attr('class', 'dot-shortage')
        .attr('cx', (d) => x(new Date(d.date)))
        .attr('cy', (d) => y(d.recoveryRate))
        .attr('r', Math.max(3, width * 0.004))
        .attr('fill', 'steelblue')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)

      // Add legend for recovery chart
      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr(
          'transform',
          `translate(${width - marginRight - 150}, ${marginTop + 20})`
        )

      // Shortage Rate legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', `${Math.max(10, width * 0.012)}px`)
        .text('Recovery Rate')

      // Thread Hold legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 20)
        .attr('dy', '0.35em')
        .style('font-size', `${Math.max(10, width * 0.012)}px`)
        .text('Thread Hold')
    } else {
      // Original shortage data logic
      const shortageData = data as IShortageRateTotal[]
      const lineBuilder = d3
        .line<IShortageRateTotal>()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.shortageRate))

      const linePath = lineBuilder(shortageData)

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
        .data(shortageData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(new Date(d.date)))
        .attr('cy', (d) => y(d.shortageRate))
        .attr('r', Math.max(3, width * 0.004))
        .attr('fill', 'steelblue')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)

      // Add legend for recovery chart
      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr(
          'transform',
          `translate(${width - marginRight - 150}, ${marginTop + 20})`
        )

      // Shortage Rate legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', `${Math.max(10, width * 0.012)}px`)
        .text('Shortage Rate')

      // Thread Hold legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 20)
        .attr('dy', '0.35em')
        .style('font-size', `${Math.max(10, width * 0.012)}px`)
        .text('Thread Hold')
    }

    // Add chart title
    const chartTitle =
      chartType === 'recovery'
        ? 'Recovery Rate Trend Over Time'
        : 'Shortage Rate Trend Over Time'

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', marginTop / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', `${Math.max(14, width * 0.018)}px`)
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .text(chartTitle)
  }, [data, dimensions])

  return <div ref={ref} style={{ width: '100%' }} />
}

export default LineChart
