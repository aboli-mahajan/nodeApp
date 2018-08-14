import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import ReactEcharts from 'echarts-for-react';


class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
	}


  render() {
    return (

      <React.Fragment>
        <Button onClick={this.props.onEditHandler}>
          <Icon name="edit"/>
        </Button>
        <ReactEcharts
          option={this.props.config}
          notMerge={true}
          lazyUpdate={true}
          />
      </React.Fragment>

    )
  }
}


export default Panel