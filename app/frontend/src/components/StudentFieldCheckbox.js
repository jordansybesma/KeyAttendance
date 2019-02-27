import React, { Component } from 'react';
import { httpPatch } from './Helpers';

class StudentFieldCheckbox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            row: {},
            checked: false
        }
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    componentDidMount() {
        if (this.props.accessor === 'is_showing') {
            this.setState({ row: this.props.row, checked: this.props.row.is_showing });
        } else if (this.props.accessor === 'quick_add') {
            this.setState({ row: this.props.row, checked: this.props.row.quick_add });
        }
    }

    componentDidUpdate() {
        if (this.props.row.info_id !== this.state.row.info_id) {
            this.setState({ row: this.props.row });
        }
        if (this.props.accessor === 'is_showing' && this.props.row.is_showing !== this.state.checked) {
            this.setState({ checked: this.props.row.is_showing });
        } else if (this.props.accessor === 'quick_add' && this.props.row.quick_add !== this.state.checked) {
            this.setState({ checked: this.props.row.quick_add });
        }
    }

    toggleCheckbox = () => {
        let self = this;
        let { row } = self.state;
        let body = {info_id: row.info_id};
        body[self.props.accessor] = !self.state.checked;
        httpPatch('http://127.0.0.1:8000/api/student_column/', body)
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

export default StudentFieldCheckbox;
