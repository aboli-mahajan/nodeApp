import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import ScrollChart from './scrollChart.jsx'
import StreamChart from './streamChart.jsx'


class ChartLoader extends React.Component {

  render() {
    return (
      <div className="chart-loader">
        <ScrollChart />
        <br />
        <br />
        <StreamChart />
      </div>
    )
  }
}

export default ChartLoader
