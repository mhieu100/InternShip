import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

interface IProps {
  groupData
}

const Barchart = (props: IProps) => {
  const { groupData } = props
  console.log(groupData[1]?.data)
  const ref = useRef(null)

  const [data, setData] = useState([
    { Country: 'United States', Value: 12394 },
    { Country: 'Russia', Value: 6148 },
    { Country: 'Germany (FRG)', Value: 1653 },
    { Country: 'France', Value: 2162 },
    { Country: 'United Kingdom', Value: 1214 },
    { Country: 'China', Value: 1131 },
    { Country: 'Spain', Value: 814 },
    { Country: 'Netherlands', Value: 1167 },
    { Country: 'Italy', Value: 660 },
    { Country: 'Israel', Value: 1263 }
  ])

    console.log(data)
  useEffect(() => {
    // set the dimensions and margins of the graph
    let margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // X axis
    let x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function (d) {
          return d.Country
        })
      )
      .padding(0.2)

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')

    // Add Y axis
    let y = d3.scaleLinear().domain([0, 13000]).range([height, 0])
    svg.append('g').call(d3.axisLeft(y))

    // Bars
    svg
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.Country)
      })
      .attr('y', function (d) {
        return y(d.Value)
      })
      .attr('width', x.bandwidth())
      .attr('height', function (d) {
        return height - y(d.Value)
      })
      .attr('fill', 'steelblue')
  }, [])

  return (
    <>
      <svg width={460} height={400} id="barchart" ref={ref} />
    </>
  )
}

export default Barchart
