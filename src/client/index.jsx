// global imports
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'       // load base styles
import 'react-grid-layout/css/styles.css'		// load react grid layout styles
import 'react-resizable/css/styles.css'			// load react resizable styles

// local imports
import App from './components/App'              // root React component
import store from './store'                     // Redux store

// local styles
import './styles/base.scss'                     // example local SASS/LESS


ReactDom.render(                                // bootstrap the app
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app')
)
