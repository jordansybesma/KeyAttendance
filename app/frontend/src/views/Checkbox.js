import React, { Component } from 'react';
import PropTypes from "prop-types";
import { httpPost, httpDelete } from '../components/Helpers';

class Checkbox extends Component {
    state = {
        isChecked: false,
        attendanceItemID:0
    };


    componentDidMount() {
        this.setState({ isChecked: this.props.checked, attendanceItemID: this.props.attendanceItemID ? this.props.attendanceItemID : 0 })
    }

    toggleCheckboxChange = () => {
        const { handleCheckboxChange, activityID, studentID } = this.props;

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));

        if (!this.state.isChecked) { // POST
            const today = new Date()
            // "date":`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,

            const result = httpPost('http://127.0.0.1:8000/api/attendance', {
                "student_id":studentID,
                "activity_id":activityID,
                "date":'2018-02-12',
                "time":`${today.getHours()}:${today.getMinutes() > 10 ? today.getMinutes() : `0${today.getMinutes()}`}:${today.getSeconds() > 10 ? today.getSeconds() : `0${today.getSeconds()}`}`,
            }).then(result => this.setState({attendanceItemID: result.id}))
        } else { // DELETE
            httpDelete(`http://127.0.0.1:8000/api/attendance?key=${this.state.attendanceItemID}`);
        }
    };

    render() {
        const { label } = this.props;
        const { isChecked } = this.state;

        return (
            <span className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        value={label}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                    />
                    {label}
                </label>
            </span>
        );
    }
}

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    activityID: PropTypes.number.isRequired,
    studentID: PropTypes.number.isRequired,
    attendanceItemID: PropTypes.number.isRequired,
    checked: PropTypes.bool.isRequired
};

export default Checkbox;
