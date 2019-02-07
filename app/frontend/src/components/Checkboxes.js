import React from 'react';
import Checkbox from'./Checkbox.js'
import { Label } from 'react-bootstrap';
import { httpDelete, httpPost, domain } from './Helpers';

class Checkboxes extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            activities: {},
            studentID: 0,
            error: "",
            numChecked: 0,
        }

        this.toggleCheckbox = this.toggleCheckbox.bind(this)
    }

    componentDidMount() {
        let numChecked = 0;
        const activities = this.props.row['activities']
        const keys = Object.keys(activities);
        for (let i = 0; i < keys.length; i++) {
            if (activities[keys[i]].value === true) {
                numChecked++;
            }
        }

        this.setState({
            activities: activities,
            studentID: this.props.row.studentID,
            numChecked: numChecked
        });
    }

    // Makes sure that the checkbox reflects whether it has been selected
    toggleCheckbox = (isChecked, label) => {
        const { activities, studentID, numChecked } = this.state;
        var self = this; // This is a cheap hack so the .then() function can have access to state

        // Get attendanceItemID, studentID, activityID from activities
        const activityID = activities[label].activityID
        const attendanceItemID = activities[label].attendanceItemID

        // Carry out API actions
        if (!isChecked) {
            // Add attendanceItem to database
            const today = new Date()
            httpPost(`http://${domain}/api/attendance/`, {
                "student_id": studentID,
                "activity_id": activityID,
                "date":`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
                "time":`${today.getHours()}:${today.getMinutes() > 10 ? today.getMinutes() : `0${today.getMinutes()}`}:${today.getSeconds() > 10 ? today.getSeconds() : `0${today.getSeconds()}`}`,
            }).then(function(result) {
                // Update state to refresh checkboxes
                if ('error' in result) {
                    self.setState({error: result.error})
                } else {
                    activities[label].value = true;
                    activities[label].attendanceItemID = result.id;
                    self.setState({activities: activities, numChecked: numChecked + 1})
                }
            });
        } else {
            // Remove attendanceItem from the database
            if (numChecked === 1) {
                // We're trying to uncheck the last checkbox
                // show some sort of visual error??
            } else {
                httpDelete(`http://${domain}/api/attendance/?key=${attendanceItemID}`).then(function(result) {
                    if ('error' in result) {
                        self.setState({error: result.error})
                    } else {
                        activities[label].value = false;
                        self.setState({activities: activities, numChecked: numChecked - 1})
                    }
                });
            }
        }
    }

    // Creates a checkbox for each activity
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
                        {this.state.numChecked < 2 && <Label bsStyle="warning">At least one box must be checked</Label>}
                        {this.state.error !== "" && <Label bsStyle="danger">Error {this.state.error}: Your changes have not been saved. Please refresh and try again.</Label>}
                        {this.createCheckboxes()}
                    </span>
                </span>
            </span>
        );
    }
}

export default Checkboxes;
