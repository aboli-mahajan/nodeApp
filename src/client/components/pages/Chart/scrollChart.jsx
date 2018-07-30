import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'


class ScrollChart extends React.Component {
  state = {
    data: undefined
  }

  async componentDidMount() {
    let data = await axios
                      .get('http://crypto-monitor.fstar.me/api/volumes/BTC-USD/byHour?limit=5000&show=date,high,low')
                      .then(r => r.data)
                      .then(r => r.map(entry => ({
                        date: new Date(entry.date).getTime(),
                        high: entry.high,
                        low: entry.low,
                      })))
                      .catch(console.warn)

    this.setState({data: data})
  }

  render() {
    var config = {}
    if(this.state.data != undefined) {
      var data = this.state.data.sort((a, b) => parseInt(a.date) - parseInt(b.date));

      config = {
        chart: {
                zoomType: 'x',
                alignTicks: true
            },
        boost: {
          useGPUTranslations: true
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
          startOnTick: true
        },
        series: [{
          type: 'line',
          data: data.map(x => [x.date, x.high])
        }],
        plotOptions: {
          line: {
            marker: {
              enabled: true,
              symbol: 'circle',
              radius: 2
            }
          },
          area: {
            marker: {
              enabled: true,
              symbol: 'circle',
              radius: 2
            }
          }
        }
      };
    }

    return (
      <div className="chart-loader">
        <ReactHighstock config={config} />
      </div>
    )
  }
}

export default ScrollChart
