import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fromImmutable } from 'react-wrappers'
import SidePanel from './SidePanel'
import axios from 'axios'
import { Button, Icon, Sidebar, Segment } from 'semantic-ui-react'
import Panel from './panel'
import { timeseries } from '../../charts/timeseriesConfig'
import ReactGridLayout, {Responsive, WidthProvider} from 'react-grid-layout'
const ResponsiveReactGridLayout = WidthProvider(Responsive)

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      panels: [
        {
          id: 1,
          name: 'Block 1',
          layouts: {
            lg: [
              {x: 0, y: 0, w: 12, h: 10},
            ], 
            sm: [
              {x: 0, y: 0, w: 6, h: 10},
            ]
          },
          chartType: undefined,
          chartConfig: undefined
        },
        {
          id: 2,
          name: 'Block 2',
          layouts: {
            lg: [
              {x: 0, y: 5, w: 6, h: 8},
            ], 
            sm: [
              {x: 0, y: 5, w: 6, h: 8},
            ]
          },
          chartType: undefined,
          chartConfig: undefined
        },
        {
          id: 3,
          name: 'Block 3',
          layouts: {
            lg: [
              {x: 6, y: 5, w: 6, h: 8},
            ], 
            sm: [
              {x: 3, y: 5, w: 6, h: 8},
            ]
          },
          chartType: undefined,
          chartConfig: undefined
        }
      ],
      selectedPanel: undefined,
      breakpoints: { lg: 1200, sm: 768 },
      cols: { lg: 12, sm: 6 }
      
    }

    this.generateLayouts = this.generateLayouts.bind(this)
    this.buttonClick = this.buttonClick.bind(this)
    this.onSidebarHide = this.onSidebarHide.bind(this)
    this.getPanels = this.getPanels.bind(this)
    this.onResizeStop = this.onResizeStop.bind(this)
    this.onDragStop = this.onDragStop.bind(this)
    this.onEditHandler = this.onEditHandler.bind(this)
    this.saveConfigHandler = this.saveConfigHandler.bind(this)
    this.setChartType = this.setChartType.bind(this)
    this.onSaveConfig = this.onSaveConfig.bind(this)
    this.onLayoutChange = this.onLayoutChange.bind(this)
  }

  async componentDidMount() {
    let data = await axios
                      .get('http://crypto-monitor.fstar.me/api/volumes/BTC-USD/byHour?limit=100&show=date,high,low')
                      .then(r => r.data)
                      .then(r => r.map(entry => ({
                        date: new Date(entry.date).getTime(),
                        high: entry.high,
                        low: entry.low,
                      })))
                      .catch(console.warn)

    this.setState({data: data.sort((a, b) => parseInt(a.date) - parseInt(b.date));})
  }

  onLayoutChange(layout, layouts) {
  //   console.log('onLayoutChange')
  }

  onResizeStop(layout) {
    this.saveLayoutToState(layout)
  }

  getSize(width) {
    if(width < 1200) {
      return 'sm'
    }
    else {
      return 'lg'
    }
  }

  saveLayoutToState(layout) {
    let { panels } = this.state
    var new_layout= {}

    var size = this.getSize(this.gridContainer.state.width)
    panels.forEach((panel) => {
      new_layout = (({ x, y, w, h }) => ({ x, y, w, h }))(layout.find((layoutItem) => { return panel.id.toString() == layoutItem.i }))
      panel.layouts[size][0] = new_layout
    })

    this.setState({ panels: panels })
  }

  onDragStop(layout) {
    this.saveLayoutToState(layout)
  }

  generateLayouts() {
    let layouts = {}
    var sizes = ['lg', 'sm']
    sizes.forEach((key) => {
      let sizeLayout = []
      this.state.panels.forEach((panel) => {
        sizeLayout.push(Object.assign({ i: panel.id.toString() }, panel.layouts[key][0]))
      })
      layouts[key] = sizeLayout
    })

    return layouts
  }

  onSidebarHide() {
    this.setState({ selectedPanel: undefined })
  }

  buttonClick(panelId) {
    var selectedPanel = this.state.panels.find((panel) => { return panel.id == panelId })
    this.setState({ selectedPanel: selectedPanel })
  }

  onEditHandler(panelId) {
    var selectedPanel = this.state.panels.find((panel) => { return panel.id == panelId })
    this.setState({ selectedPanel: selectedPanel })
  }

  setChartType(type, selectedPanel) {
    var config = {}
    switch(type) {
      case 'line':
      case 'bar':
      case 'area': {
        config = Object.assign({}, timeseries, {
          series: [{
            type: type,
            data: this.state.data.map(x => {
              return {
                name: x.date,
                value: [x.date, x.high]
              }
            })
          }],
          yAxis: {
            min: 'dataMin'
          }
        })

        if(type == "area") {
          config.series[0].areaStyle = {}
          config.series[0].type = "line"
        }
        break;
      }
    }

    this.setState({ panels: this.state.panels.map((panel) => panel.id === this.state.selectedPanel.id ? (Object.assign(panel, {chartConfig: config, chartType: type})) : panel), selectedPanel: Object.assign(selectedPanel, {chartType: type}) })
  }

  // Not used currently
  saveConfigHandler(chartConfig, chartFeatures, selectedPanel) {
    console.log('saveConfigHandler chartFeatures', chartFeatures)
    this.onSidebarHide()

    let type = selectedPanel.chartType

    var config = {}
    switch(type) {
      case 'line':
      case 'bar':
      case 'area': {
        config = Object.assign({}, chartConfig, {
          title: {
            text: chartFeatures.chartName ? chartFeatures.chartName : 'Chart 1'
          },
          tooltip: (chartFeatures.tooltipEnabled ? {} : false),
          series: [{
            name: chartFeatures.seriesName ? chartFeatures.seriesName : 'Series 1'
            type: type,
            data: this.state.data.map(x => {
              return {
                name: x.date,
                value: [x.date, x.high]
              }
            })
          }]
        })

        break;
      }
    }

    this.setState({ panels: this.state.panels.map((panel) => panel.id === this.state.selectedPanel.id ? (Object.assign(panel, {chartConfig: config, chartType: type})) : panel), selectedPanel: undefined })
  }

  onSaveConfig(attribute, chartFeatures, selectedPanel) {
    var config = {}
    switch(attribute) {
      case 'chartName': {
        config = Object.assign({}, selectedPanel.chartConfig, { title: { text: chartFeatures.chartName } } )
        this.setState({ selectedPanel: Object.assign(selectedPanel , {chartConfig: config }) })
        break;
      }
      case 'seriesName': {
        config = Object.assign({}, selectedPanel.chartConfig.series[0], { name: chartFeatures.seriesName } )
        this.setState({ selectedPanel: Object.assign(selectedPanel , { chartConfig: Object.assign(selectedPanel.chartConfig, { series: [config] }) }) })
        break;
      }
      case 'tooltip': {
        config = Object.assign({}, selectedPanel.chartConfig, { tooltip: (chartFeatures.tooltipEnabled ? {} : false) } )
        this.setState({ selectedPanel: Object.assign(selectedPanel , {chartConfig: config }) })
        break;
      }
    }

  }

  getPanels() {
    console.log('Panels in state', this.state.panels)
    return this.state.panels.map((panel) => {
        return <div key={panel.id} style={{background: '#F2F4F4', position: 'relative'}}>
          {panel.chartConfig == undefined ? (<Button className="middle" style={{left: "48%"}} onClick={() => this.buttonClick(panel.id)}>Add Widget</Button>) : <Panel config={panel.chartConfig} onEditHandler={() => this.onEditHandler(panel.id)}/>}
        </div>
    })
  }

  render () {
    return (

      <React.Fragment>
        <Sidebar.Pushable as={Segment}>
            <SidePanel selectedPanel={this.state.selectedPanel} onSidebarHide={this.onSidebarHide} selectedOption={this.selectedOption} onSaveConfig={this.onSaveConfig} setChartType={this.setChartType}/>

            <Sidebar.Pusher >
              <Segment basic>
                <ResponsiveReactGridLayout className="layout" layouts={this.generateLayouts()}
                  onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)} cols={this.state.cols} rowHeight={30} breakpoints={this.state.breakpoints} onResizeStop={this.onResizeStop}
                   onDragStop={this.onDragStop} ref={(container) => this.gridContainer = container}>
                  {this.getPanels()}
                </ResponsiveReactGridLayout>
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>        
      </React.Fragment>

    )
  }
}


export default Layout
