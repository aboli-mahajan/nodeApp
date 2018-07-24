import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Modal, Header, Button, Icon } from 'semantic-ui-react'
import list from '../../../state/list'
import { fromImmutable } from 'react-wrappers'
import { Input, Form } from 'semantic-ui-react'


class EditModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = { value: '' }
    this.changeValue = this.changeValue.bind(this)
    this.editItem = this.editItem.bind(this)
  }

  changeValue(e) {
    this.setState({ value: e.target.value })
  }

  editItem() {
    this.props.editItem(this.state.value)
    this.props.closeModal()
    this.setState({ value: '' })
  }

  componentDidUpdate(prevProps, prevState) {
    let { editingItem } = this.props

    if (editingItem && editingItem !== prevProps.editingItem) {
      this.setState({ value: editingItem.name })
    }
  }

  render() {
    let { closeModal } = this.props

    return (
    <Modal size='small' open={!!this.props.editingItem} onClose={closeModal}>
      <Header icon='edit' content='Edit Name' />
      <Modal.Content>
        <Form onSubmit={this.editItem}>
          <Input
            fluid
            label='Name'
            actionPosition='left'
            onChange={this.changeValue}
            value={this.state.value}
            />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={closeModal}>
          <Icon name='remove' /> Cancel
        </Button>
        <Button color='green' inverted onClick={this.editItem}>
          <Icon name='save' /> Update
        </Button>
      </Modal.Actions>
    </Modal>
  )
  }
}

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isOpen: list.isEditing(state),
  editingItem: list.getEditingItem(state)
})

export default connect(mapStateToProps, list.actions)(fromImmutable(EditModal))
