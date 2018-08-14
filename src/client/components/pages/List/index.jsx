import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fromImmutable } from 'react-wrappers'
import { Divider, Table } from 'semantic-ui-react'
import Item from './Item'
import AddItem from './AddItem'
import EditModal from './EditModal'
import list from '../../../state/list'

const List = ({ items = [], addItem, removeItem, toggleIsActive, setEditTarget, closeModal, editItem, editingItem }) => {
  return (
  <React.Fragment>
    <AddItem addItem={addItem} />
    <Divider horizontal>{ items.length } Items</Divider>
    <Table compact celled definition>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Id</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Created</Table.HeaderCell>
          <Table.HeaderCell>Active</Table.HeaderCell>
          <Table.HeaderCell>Edit Name</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {
          items.map(item => <Item
                              key={item.id}
                              item={item}
                              removeItem={() => removeItem(item.id)}
                              toggleIsActive={() => toggleIsActive(item.id)}
                              setEditTarget={() => setEditTarget(item.id)}
                            />
                    )
        }
      </Table.Body>
    </Table>
    <EditModal editItem={editItem}/>
  </React.Fragment>
  )
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  toggleIsActive: PropTypes.func.isRequired,
  setEditTarget: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  items: list.getItems(state),
  editingItem: list.getEditingItem(state),
})


export const ConnectedList = connect(mapStateToProps, list.actions)(fromImmutable(List))

export default List





/* mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
a.js

export const foo = 'bar'
export const cat = 'dog'\

export default {
  foo, cat
}

mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

b.js

import myLib, { foo } from 'a.js'

console.log(foo) // 'bar'
console.log(myLib.foo) // { cat: 'dog' }

*/



