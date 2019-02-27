import React, { Component } from 'react';
import { httpPatch } from './Helpers';

class ShowActivityCheckbox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            row: {},
            checked: false
        }
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    componentDidMount() {
        this.setState({ row: this.props.row, checked: this.props.row.is_showing })
    }

    componentDidUpdate() {
        if (this.props.row.is_showing !== this.state.checked) {
            this.setState({ checked: this.props.row.is_showing })
        }
    }

    toggleCheckbox = () => {
        let self = this;
        let { row } = self.state;
        let body = {activity_id: row.activity_id, is_showing: !self.state.checked};
        httpPatch('http://127.0.0.1:8000/api/activities/', body)
            .then(function (result) {
                if ('error' in result) {
                    result.response.then(function(response) {alert(`Error: ${response.error}`)});
                } else {
                    const updateCheckbox = () => self.props.CustomFunction(result);
                    updateCheckbox();
                }
            });
    };

    render() {
        return (
            <span className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={this.state.checked}
                        onChange={this.toggleCheckbox}
                    />
                </label>
            </span>
        );
    }
}

export default ShowActivityCheckbox;
