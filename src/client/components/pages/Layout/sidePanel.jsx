import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Sidebar, Modal, Header, Button, Icon, Menu, Form, Checkbox } from 'semantic-ui-react'
import list from '../../../state/list'
import { fromImmutable } from 'react-wrappers'
import ChartForm from '../../charts/chartForm'


class SidePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: undefined,
      isEditing: false,
      config: {
        name: undefined,
        seriesName: undefined,
        tooltip: false
      }
    }
    this.openForm = this.openForm.bind(this)
  }

  openForm(type, selectedPanel) {
    let { isEditing } = this.state
    this.setState({ type: type, isEditing: !isEditing })
  }

  render() {
    return (
        <Sidebar
          as={Menu}
          animation='scale down'
          icon='labeled'
          inverted
          vertical
          direction='right'
          visible={this.props.selectedPanel!=undefined}
          width='wide'
          onHide={this.props.onSidebarHide}
        >
          <Menu.Item as='a' onClick={() => this.props.setChartType('line', this.props.selectedPanel)}>
            <Icon name='chart line' />
            Line Chart
          </Menu.Item>
          <Menu.Item as='a' onClick={() => this.props.setChartType('bar', this.props.selectedPanel)}>
            <Icon name='chart bar' />
            Bar Chart
          </Menu.Item>
          <Menu.Item as='a' onClick={() => this.props.setChartType('area', this.props.selectedPanel)}>
            <Icon name='chart area' />
            Area Chart
          </Menu.Item>
          <br/>
          <br/>
          <ChartForm selectedPanel={this.props.selectedPanel} onSaveConfig={this.props.onSaveConfig}/>
        </Sidebar>

    )
  }
}

export default SidePanel