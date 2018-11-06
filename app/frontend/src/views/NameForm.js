import React from "react";
import { Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        const timeStamp = new Date();
        const utcDate = timeStamp.toJSON().replace(/T/, ' ').replace(/\..+/, '');

        if (this.state.value !== '') {
            alert('The name ' + this.state.value + ' was submitted at time ' + utcDate);
            event.preventDefault();
        }
        else {
            alert('The name you entered is empty. Try again.')
        }

    }

    render() {
        return (
            <Form inline onSubmit={this.handleSubmit}>
                <FormGroup controlId="searchPlaceholder">
                    <ControlLabel>Name</ControlLabel>{' '}
                    <FormControl type="text" onChange={this.handleChange} value={this.state.value} placeholder="Jane Doe"/>
                </FormGroup>{' '}
                
                <Button type="submit">Submit</Button>
            </Form>
        );
    }
}
export default NameForm;