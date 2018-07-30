import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'


class StreamChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {},
      intervalId: undefined,
      currentCount: 0
    }
  }

  componentDidMount() {
    var intervalId = setInterval(() => {
      this.setState({ currentCount: this.state.currentCount + 1 })
      console.log("Called timer function")
      console.log("count", this.state.currentCount)}, 2000);
    this.setState({ intervalId: intervalId })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidUpdate(prevProps, prevState) {
    var config = {}
    config = {
        chart: {
                zoomType: 'x',
                alignTicks: true
            },
        rangeSelector: {
          selected: 1,
          allButtonsEnabled: true,
          buttons: [{
            type: 'minute',
            count: 1,
            text: 'minute'
          },{
            type: 'hour',
            count: 1,
            text: 'hour'
          },{
            type: 'day',
            count: 1,
            text: 'day'
          },{
            type: 'all',
            text: 'All'
          }],
          buttonTheme: {
            width: 50
          },
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            month: '%e. %b',
            year: '%b'
          },
          
        },
        yAxis: {
          min: null,
          max: null,
          startOnTick: true
        },
        series: [{
          type: 'line',
          data: undefined
        }],
        plotOptions: {
          line: {
            width: 2,
            marker: {
              enabled: true,
              symbol: 'circle',
              radius: 2
            }
          }
        }
      }

    if(this.state.currentCount <= 1 && this.props.fixedData != undefined){
      console.log("Here", this.state.currentCount)
      let { fixedData } = this.props
      config.series[0].data = fixedData.map(x => [x.date, x.high])
      this.state.config = config
    }

    else {
      const chart = this.chart.getChart()
      let { streamingData } = this.props
      console.log('this.chart', chart.series[0])
      if (chart.series[0] != undefined) {
        var value = streamingData.pop()
        console.log("value", value)
        chart.series[0].addPoint([value.date, value.high], true, true, false)
      }
    }
  }

  render() {
    return (
      <div className="chart-loader">
        <ReactHighstock config={this.state.config} isPureConfig={true} ref={ref => this.chart = ref}/>
      </div>
    )
  }
}

export default StreamChartComponent
