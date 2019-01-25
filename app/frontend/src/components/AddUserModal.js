import React from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { httpPost } from './Helpers';

class AddUserModal extends React.Component {
    
    constructor(props) {
		super(props)
		
        this.state = {
            username: '',
            first_name: '',
            last_name: '',
            password: '',
            confirmPassword: '',
            is_active: true,
            error: false,
            backendError: false,
            checkboxes: [],
            show: false
		}
		
		this.cancel = this.cancel.bind(this);
		this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.handleActiveCheckbox = this.handleActiveCheckbox.bind(this);
        this.createCheckboxes = this.createCheckboxes.bind(this);
    }
    
    componentDidUpdate() {
        if (this.props.show !== this.state.show) {
            const checkboxes = [];
            const role_names = Object.keys(this.props.role_ids);
            for (var index in role_names) {
                checkboxes.push({label: role_names[index], checked: false})
            }
            this.setState({
                checkboxes: checkboxes,
                show: this.props.show
            });
        }
    }

	validateInput() {
		const { username, password, confirmPassword } = this.state;
		if (username.length > 0 && password.length > 0 && password === confirmPassword) {
			return 'success';
		} else if (username.length === 0 && password.length === 0 && confirmPassword.length === 0) {
			return null;
		} else {
			return 'error';
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

    handleActiveCheckbox = e => {
        this.setState({is_active: !this.state.is_active});
    }

	cancel() {
        this.setState({
            username: '',
            first_name: '',
            last_name: '',
            password: '',
            confirmPassword: '',
            is_active: true, 
            error: false, 
            backendError: false
        });
        this.props.onSubmit();
	}

	submit() {
        const self = this;
        self.setState({backendError: false});
        if (self.validateInput() !== 'success') {
            self.setState({error: true});
            return;
        } else {
            self.setState({error: false});
        }
        const checkboxes = self.state.checkboxes;
        const groups = [];
        for (var index in checkboxes) {
            if (checkboxes[index].checked) {
                groups.push(self.props.role_ids[checkboxes[index].label])
            }
        }
        const body = {username: self.state.username,
            password: self.state.password,
            first_name: self.state.first_name,
            last_name: self.state.last_name,
            groups: groups,
            is_active: self.state.is_active};
        httpPost('http://127.0.0.1:8000/api/users/', body)
            .then(function (result) {
                if ('error' in result) {
                    self.setState({backendError: true});
                } else {
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

    render() {
        return(
            <Modal show={this.props.show}>
				<Modal.Header>
					<Modal.Title>Create New User</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<form>
						<FormGroup
							validationState={this.validateInput()}
						>
							<ControlLabel>Username</ControlLabel>
							<FormControl
                                type="text"
                                name="username"
								value={this.state.username}
								placeholder="Username"
								onChange={this.handleChange}
							/>
							<br/>
                            <ControlLabel>First Name</ControlLabel>
							<FormControl
                                type="text"
                                name="first_name"
								value={this.state.first_name}
								placeholder="First Name"
								onChange={this.handleChange}
							/>
							<br/>
                            <ControlLabel>Last Name</ControlLabel>
							<FormControl
                                type="text"
                                name="last_name"
								value={this.state.last_name}
								placeholder="Last Name"
								onChange={this.handleChange}
							/>
							<br/>
							<ControlLabel>Password</ControlLabel>
							<FormControl
                                type="password"
                                name="password"
								value={this.state.password}
								placeholder="Password"
								onChange={this.handleChange}
							/>
                            <br />
                            <ControlLabel>Confirm Password</ControlLabel>
							<FormControl
                                type="password"
                                name="confirmPassword"
								value={this.state.confirmPassword || ''}
								placeholder="Confirm Password"
								onChange={this.handleChange}
							/>
                            <br />
                            <ControlLabel>Active</ControlLabel>
							<FormControl
                                type="checkbox"
                                checked={this.state.is_active}
								value={this.state.is_active}
								onChange={this.handleActiveCheckbox}
							/>
                            <ControlLabel>User Roles</ControlLabel>
                            {this.createCheckboxes()}
							<FormControl.Feedback />
						</FormGroup>
					</form>
				</Modal.Body>

				<Modal.Footer>
                    {this.state.error && <Alert bsStyle='danger'>Invalid input. Please check your fields and try again.</Alert>}
                    {this.state.backendError && <Alert bsStyle='danger'>Server error. Please try again.</Alert>}
					<Button onClick={this.cancel}>Cancel</Button>
					<Button onClick={this.submit} bsStyle="primary">Create</Button>
				</Modal.Footer>
			</Modal>
        )
    }
}

export default AddUserModal;
