import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import StreamChartComponent from './streamChartComponent.jsx'


class StreamChart extends React.Component {
  state = {
    data: undefined,
    fixedData: undefined,
    streamingData: undefined
  }

  async componentDidMount() {
    let data = await axios
                      .get('http://crypto-monitor.fstar.me/api/volumes/BTC-USD/byMinute?limit=2500&show=date,high,low')
                      .then(r => r.data)
                      .then(r => r.map(entry => ({
                        date: new Date(entry.date).getTime(),
                        high: entry.high,
                        low: entry.low,
                      })))
                      .catch(console.warn)

    data = data.sort((a, b) => parseInt(a.date) - parseInt(b.date));
    var fixedData = data.splice(0. data.length/2)
    var streamingData = data.splice(data.length/2-1, data.length).sort((a, b) => parseInt(b.date) - parseInt(a.date))
    this.setState({data: data, fixedData: fixedData, streamingData: streamingData})
  }


  render() {
    return (
      <StreamChartComponent fixedData={this.state.fixedData} streamingData={this.state.streamingData} />
    )
  }
}

export default StreamChart
