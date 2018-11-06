import React from 'react';
import Checkbox from'./Checkbox.js'
import { httpDelete, httpPost } from '../components/Helpers';

class Checkboxes extends React.Component {

    createCheckboxes = () => {
        var boxes = []
        const activities = this.props.row['activities'];
        const keys = Object.keys(activities);
        for (var i = 0; i < keys.length; i++) {
            boxes.push(
                <Checkbox
                    label={keys[i]}
                    key={keys[i]}
                    checked={activities[keys[i]].value}
                    activityID={activities[keys[i]].activityID}
                    attendanceItemID={activities[keys[i]].attendanceItemID}
                    studentID={this.props.row.studentID}
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
