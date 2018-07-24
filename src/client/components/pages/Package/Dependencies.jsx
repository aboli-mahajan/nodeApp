import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Message } from 'semantic-ui-react'
import List from './List'

var tempDeps = [{name: "test1", version: "1.0"}, {name: "test2", version: "1.2"}]

const Dependencies = ({ deps, devDeps }) =>
  <Message positive>
    <Grid columns={3} divided>
      <Grid.Row>
        <Grid.Column>
          <List name="Dependencies" libs={deps} />
        </Grid.Column>
        <Grid.Column>
          <List name="Test Dependencies" libs={tempDeps} />
        </Grid.Column>
        <Grid.Column>
          <List name="Dev. Dependencies" libs={devDeps} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Message>

Dependencies.propTypes = {
  deps: PropTypes.array,
  devDeps: PropTypes.array,
}

Dependencies.defaultProps = {
  deps: [],
  devDeps: [],
}

export default Dependencies
