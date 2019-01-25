import React from 'react';
import { Button } from 'react-bootstrap';
import EditRoleModal from './EditRoleModal';

class EditRoleButton extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            row: {},
            showModal: false,
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.setState({
            row: this.props.row,
        });
    }

    openModal() {
        this.setState({showModal: true});
    }

    closeModal(role=null) {
        const { row } = this.state;
        if (role !== null) {
            this.props.row.permissions = role.permissions;
            row.permissions = role.permissions;
        }
        this.setState({showModal: false, row: row});
    }

    componentDidUpdate() {
        if (this.props.row['id'] !== this.state.row['id']) {
            this.setState({
                row: this.props.row,
            })
        }
    }

    render() {
        return(
            <div>
                <EditRoleModal show={this.state.showModal} row={this.props.row} onSubmit={this.closeModal}/>
                <Button bsStyle="link" onClick={this.openModal}>Edit User Role</Button>
            </div>
        )
    }
}

export default EditRoleButton;
