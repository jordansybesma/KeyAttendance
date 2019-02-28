import React from 'react';
import { httpPost, domain, protocol } from './Helpers';
import { Alert, Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class AddRoleModal extends React.Component {
    
    constructor(props) {
		super(props)
		
        this.state = {
            show: false,
            name: '',
            permission_ids: {},
            checkboxes: [],
            error: false,
            backendError: false,
            errorMsg: ''
		}
		
		this.cancel = this.cancel.bind(this);
		this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createCheckboxes = this.createCheckboxes.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }
    
    componentDidUpdate() {
        if (this.props.show !== this.state.show) {
            const checkboxes = [];
            const perm_ids = this.props.permission_ids;
            const perm_names = Object.keys(perm_ids);
            for (var index in perm_names) {
                const perm_name = perm_names[index];
                if (perm_name.includes('group')) {
                    perm_name = perm_name.replace('group', 'user role');
                } else if (perm_name.includes('activity')) {
                    perm_name = perm_name.replace('activity', 'programming');
                } else if (perm_name.includes('attendance items')) {
                    perm_name = perm_name.replace('attendance items', 'attendance entries');
                } else if (perm_name.includes('student column')) {
                    perm_name = perm_name.replace('student column', 'student field');
                } else if (perm_name.includes('city span students')) {
                    perm_name = perm_name.replace('city span students', 'student keys');
                }
                checkboxes.push({label: perm_name, checked: false})
            }
            this.setState({
                permission_ids: this.props.permission_ids,
                checkboxes: checkboxes,
                show: this.props.show
            });
        }
    }
    
    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        });
    };

	cancel() {
        this.setState({name: '', error: false, backendError: false, errorMsg: ''});
		this.props.onSubmit();
	}

	submit() {
        const self = this;
        self.setState({backendError: false});
        if (self.validateInput() === 'error') {
            self.setState({error: true});
            return;
        } else {
            self.setState({error: false});
        }
        let body = { name: self.state.name };
        let permissions = [];
        const checkboxes = self.state.checkboxes;
        for (var index in checkboxes) {
            if (checkboxes[index].checked) {
                permissions.push(self.state.permission_ids[checkboxes[index].label])
            }
        }
        if (permissions.length < 1) {
            self.setState({error: true});
            return;
        }
        body["permissions"] = permissions;
        httpPost(`${protocol}://${domain}/api/groups/`, body)
            .then(function (result) {
                if ('error' in result) {
                    result.response.then(function(response) {
                        self.setState({backendError: true, errorMsg: response.error});
                    });
                } else {
                    self.setState({name: ''});
                    self.props.onSubmit(result);
                }
            })
    }

    toggleCheckbox(index) {
        const { checkboxes } = this.state;
        checkboxes[index].checked = !checkboxes[index].checked;

        this.setState({
            checkboxes
        });
    }
    
    createCheckboxes() {
        const { checkboxes } = this.state;
    
        return checkboxes
            .map((checkbox, index) =>
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            checked={checkbox.checked}
                            onChange={this.toggleCheckbox.bind(this, index)}
                        />
                        {checkbox.label}
                    </label>
                </div>
            );
    }

    validateInput() {
		const { name } = this.state;
        const regex = /^[a-z0-9 .@+\-_]+$/i;
        if (name.length > 0 && regex.test(name)) {
            return 'success';
        } else if (name.length === 0) {
			return null;
		} else {
			return 'error';
		}
    }

    render() {
        let errorMsg = "Server error. Please try again.";
        if (this.state.errorMsg !== '' && this.state.errorMsg !== null) {
            errorMsg = this.state.errorMsg;
        }
        return(
            <Modal show={this.props.show}>
				<Modal.Header>
					<Modal.Title>Create New User Role</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<form>
						<FormGroup
                            validationState={this.validateInput()}
                        >
							<ControlLabel>Role Name</ControlLabel>
							<FormControl
                                type="text"
                                name="name"
								value={this.state.name}
								placeholder="Role Name"
								onChange={this.handleChange}
							/>
							<br/>
							{this.createCheckboxes()}
							<FormControl.Feedback />
						</FormGroup>
					</form>
				</Modal.Body>

				<Modal.Footer>
                    {this.state.error && <Alert bsStyle='danger'>Invalid input. Please check your fields and try again.</Alert>}
                    {this.state.backendError && <Alert bsStyle='danger'>{errorMsg}</Alert>}
					<Button onClick={this.cancel}>Cancel</Button>
					<Button onClick={this.submit} bsStyle="primary">Create</Button>
				</Modal.Footer>
			</Modal>
        )
    }
}

export default AddRoleModal;
