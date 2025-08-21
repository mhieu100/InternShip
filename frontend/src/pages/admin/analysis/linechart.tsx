/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

interface IData {
  date: string
  rate: number
}

const LineChart = () => {
  const ref = useRef<HTMLDivElement>(null)

  const data: IData[] = [
    {
      date: '2025-04-10',
      rate: 20
    },
    {
      date: '2025-04-11',
      rate: 40
    },
    {
      date: '2025-04-12',
      rate: 35
    },
    {
      date: '2025-04-13',
      rate: 40
    },
    {
      date: '2025-04-14',
      rate: 15
    },
    {
      date: '2025-04-15',
      rate: 15
    },
    {
      date: '2025-04-16',
      rate: 60
    }
  ]

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return

    const container = d3.select(ref.current)
    container.selectAll('*').remove()

    const width = 1200
    const height = 500
    const marginTop = 20
    const marginRight = 30
    const marginBottom = 30
    const marginLeft = 40

    const chartPadding = 50

    const x = d3.scaleUtc(
      d3.extent(data, (d) => new Date(d.date)) as [Date, Date],
      [marginLeft + chartPadding, width - marginRight - chartPadding]
    )

    const y = d3.scaleLinear(
      [0, d3.max(data, (d) => d.rate) ?? 0],
      [height - marginBottom, marginTop]
    )

    const line = d3
      .line<IData>()
      .x((data) => x(new Date(data.date)))
      .y((data) => y(data.rate))

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%, height: auto; height: intrinsic')

    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 150)
          .tickSizeOuter(0)
      )

    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(width / 80))
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
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('Daily close (%)')
      )

    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(data))
  }, [data])

  return <div ref={ref} style={{ width: '100%' }} />
}

export default LineChart
