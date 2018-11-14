import React from 'react';
import Checkbox from'./Checkbox.js'
import { httpDelete, httpPost } from '../components/Helpers';

class Checkboxes extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            activities: {},
            studentID: "",
        }

        this.toggleCheckbox = this.toggleCheckbox.bind(this)
    }

    componentDidMount() {
        this.setState({
            activities: this.props.row['activities'],
            studentID: this.props.row.studentID,
        });
    }

    toggleCheckbox = (isChecked, label) => {
        const { activities, studentID } = this.state;
        const keys = Object.keys(activities);
        var self = this; // This is a cheap hack so the .then() function can have access to state

        // Get attendanceItemID, studentID, activityID from activities
        const activityID = activities[label].activityID
        const attendanceItemID = activities[label].attendanceItemID

        // Carry out API actions
        if (!isChecked) {
            // Add attendanceItem to database
            const today = new Date()
            // "date":`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            const result = httpPost('http://127.0.0.1:8000/api/attendance', {
                "student_id": studentID,
                "activity_id": activityID,
                "date":'2018-02-12',
                "time":`${today.getHours()}:${today.getMinutes() > 10 ? today.getMinutes() : `0${today.getMinutes()}`}:${today.getSeconds() > 10 ? today.getSeconds() : `0${today.getSeconds()}`}`,
            }).then(function(result) {
                // Update state to refresh checkboxes
                activities[label].attendanceItemID = result.id;
                self.setState({activities})
            });
        } else {
            // Remove attendanceItem from the database
            httpDelete(`http://127.0.0.1:8000/api/attendance?key=${attendanceItemID}`);
        }
    }

    createCheckboxes = () => {
        const { activities } = this.state;
        const keys = Object.keys(activities);
        var boxes = [];
        for (var i = 0; i < keys.length; i++) {
            boxes.push(
                <Checkbox
                    label={keys[i]}
                    key={keys[i]}
                    checked={activities[keys[i]].value}
                    toggleCheckbox={this.toggleCheckbox}
                />
            )
        }
        return boxes;
    };

    render() {
        return (
            <span className="container">
                <span className="row">
                    <span className="col-sm-12">
                        {this.createCheckboxes()}
                    </span>
                </span>
            </span>
        );
    }
}

export default Checkboxes;
