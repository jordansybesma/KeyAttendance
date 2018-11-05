import React from "react";


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
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
export default NameForm;