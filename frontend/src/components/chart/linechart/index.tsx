import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'
import { useSpring, animated } from '@react-spring/web'
import { Card } from 'antd'

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 }

type Datapoint = { x: number; melanie: number }

type LineChartProps = {
  width: number
  height: number
  data: Datapoint[]
}

export const LineChartDemo = ({ width, height, data }: LineChartProps) => {
  const axesRef = useRef(null)
  const boundsWidth = width - MARGIN.right - MARGIN.left
  const boundsHeight = height - MARGIN.top - MARGIN.bottom

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0])
  }, [boundsHeight])

  const xScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 10]).range([0, boundsWidth])
  }, [boundsWidth])

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current)
    svgElement.selectAll('*').remove()

    const xAxisGenerator = d3.axisBottom(xScale)
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator)

    const yAxisGenerator = d3.axisLeft(yScale)
    svgElement.append('g').call(yAxisGenerator)

    svgElement
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.melanie))
      .attr('r', Math.max(3, width * 0.004))
      .attr('fill', 'steelblue')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    svgElement
      .append('text')
      .attr('x', width / 2)
      .attr('y', MARGIN.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', `${Math.max(14, width * 0.018)}px`)
      .style('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .text('Shortage Rate Trend Over Time')
  }, [xScale, yScale, boundsHeight, data, width])

  const lineBuilder = d3
    .line<Datapoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.melanie))
  const linePath = lineBuilder(data)

  if (!linePath) {
    return null
  }

  return (
    <Card title="Shelf Details" className="shadow-sm">
      <svg width={width} height={height}>
        {/* first group is lines */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          <LineItem path={linePath} color={'#69b3a2'} />
        </g>
        {/* Second is for the axes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </svg>
    </Card>
  )
}

type LineItemProps = {
  path: string
  color: string
}

const LineItem = ({ path, color }: LineItemProps) => {
  const springProps = useSpring({
    to: {
      path,
      color
    },
    config: {
      friction: 100
    }
  })

  return (
    <animated.path
      d={springProps.path}
      fill={'none'}
      stroke={color}
      strokeWidth={2}
    />
  )
}
