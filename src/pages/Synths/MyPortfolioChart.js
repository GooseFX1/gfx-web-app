import React, { Component } from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2'

const WRAPPER = styled.div`
  height: 600px;
  width: 445px;
`

export default class MyPortfolioChart extends Component {
  setGradient() {
    var ctx = document.getElementById('canvas').getContext('2d')
    var gradient = ctx.createLinearGradient(0, 0, 0, 250)
    gradient.addColorStop(0.25, 'rgba(150, 37, 174, 0.58)')
    gradient.addColorStop(0.95, 'rgba(42, 42, 42, 0)')

    return gradient
  }

  setPointGradient() {
    var ctx = document.getElementById('canvas').getContext('2d')
    var gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0.25, 'rgba(54, 54, 172, 1)')
    gradient.addColorStop(0.95, 'rgba(150, 37, 174, 1)')

    return gradient
  }

  constructor(props) {
    super(props)

    this.state = {
      data: {
        labels: ['', '', '', '', '', '', '', '', '', '', ''],
        datasets: [
          {
            label: '',
            active: false,
            data: [8, 22, 40, 44, 36, 10, 35, 38, 56, 58, 50],
            fill: true,
            tension: 0.4,
            pointBorderColor: '#ffffff',
            pointBackgroundColor: this.setPointGradient,
            pointRadius: [0, 0, 0, 0, 0, 0, 6, 0, 0, 0],
            pointHoverRadius: [0, 0, 0, 0, 0, 0, 8, 0, 0, 0],
            pointBorderWidth: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
            pointHoverBorderWidth: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
            borderWidth: 2,
            backgroundColor: this.setGradient,
            borderColor: '#ad56c0'
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        responsive: true,
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      }
    }
  }

  render() {
    return (
      <WRAPPER>
        <Line data={this.state.data} options={this.state.options} id={'canvas'} />
      </WRAPPER>
    )
  }
}
