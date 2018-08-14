import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Icon, Checkbox } from 'semantic-ui-react'
import chartConfigs from './'

class ChartForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
      features:{
        chartName: undefined,
        tooltipEnabled: false,
        seriesName: undefined
      }
    }

    this.setTitle = this.setTitle.bind(this)
    this.toggleTooltip = this.toggleTooltip.bind(this)
    this.setSeriesName = this.setSeriesName.bind(this)
    this.setConfigTitle = this.setConfigTitle.bind(this)
    this.setConfigSeriesName = this.setConfigSeriesName.bind(this)
	}

  setTitle(e) {
    let { features } = this.state
    this.setState({ features: Object.assign({}, features, { chartName: e.target.value }) })
  }

  toggleTooltip(e) {
    let { features } = this.state
    let newFeatures = Object.assign({}, features, { tooltipEnabled: !features.tooltipEnabled })
    this.setState({ features: newFeatures })
    this.props.onSaveConfig('tooltip', newFeatures, this.props.selectedPanel)
  }

  setSeriesName(e) {
    let { features } = this.state
    this.setState({ features: Object.assign({}, features, { seriesName: e.target.value }) })
  }

  setConfigSeriesName() {
    console.log('set config seriesname')
    this.props.onSaveConfig('seriesName', this.state.features, this.props.selectedPanel)
  }

  setConfigTitle() {
    console.log('on title submit', this.state.features.chartName)
    this.props.onSaveConfig('chartName', this.state.features, this.props.selectedPanel)
  }


  componentDidUpdate(prevProps, prevState) {
    let { selectedPanel } = this.props

    if(selectedPanel && selectedPanel != prevProps.selectedPanel) {
      if(selectedPanel.chartConfig != undefined) {
        this.setState({ features: { 
                                  chartName: selectedPanel.chartConfig.title.text,
                                  tooltipEnabled: Object.keys(selectedPanel.chartConfig.tooltip).length == 0,
                                  seriesName: selectedPanel.chartConfig.series[0].name 
                                } 
                      })
      }
      else {
        this.setState({ features: {chartName: undefined, tooltipEnabled: false, seriesName: undefined} })
      }
    }
  }

  render() {
    if (this.props.selectedPanel && this.props.selectedPanel.chartType) {
      let { chartType } = this.props.selectedPanel
      if (chartType == "line" || chartType == 'bar' || chartType == 'area') {
        chartType = "timeseries"
      }

      let chartFeatures = chartConfigs[chartType].features
      let chartConfig = chartConfigs[chartType].config

      console.log('selectedPanel', this.props.selectedPanel)
      console.log('chartFeatures', chartFeatures)
      console.log('chartConfig', chartConfig)
      console.log('this.state.features', this.state.features)

      return(
        <div>
          <TitleEditor setTitle={this.setTitle} chartName={this.state.features.chartName} setConfigTitle={this.setConfigTitle}/>
          { chartFeatures.seriesSelector ? <SeriesSelector seriesName={this.state.features.seriesName} setSeriesName={this.setSeriesName} setConfigSeriesName={this.setConfigSeriesName}/> : '' }
          { chartFeatures.tooltip ? <ToolTipToggler tooltipEnabled={this.state.features.tooltipEnabled} toggleTooltip={this.toggleTooltip}/> : '' }
        </div>
        // <Button type='submit' onClick={() => this.props.onSaveConfig(chartConfig, this.state.features, this.props.selectedPanel)}> Submit </Button>
      )
    }
    else {
      return null
    }
  }
}

export default ChartForm






const TitleEditor = ({ chartName, setTitle, setConfigTitle }) =>
  <Form inverted onSubmit={setConfigTitle}>
    <Form.Field>
      <label>Chart Name</label>
      <input placeholder='Chart Name' value={chartName} onChange={setTitle} />
    </Form.Field>
  </Form>



const ToolTipToggler = ({ tooltipEnabled, toggleTooltip }) =>
  <Form inverted>
    <Form.Field>
      <Checkbox toggle label='Keep tooltip' checked={tooltipEnabled} onChange={toggleTooltip} />
    </Form.Field>
  </Form>



const SeriesSelector = ({ seriesName, setSeriesName, setConfigSeriesName }) =>
  <Form inverted onSubmit={setConfigSeriesName}>
    <Form.Field>
      <label>Series Name</label>
      <input placeholder='Series Name' value={seriesName} onChange={setSeriesName} />
    </Form.Field>
  </Form>