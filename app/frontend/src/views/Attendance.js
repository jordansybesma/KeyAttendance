import React from 'react';
import ReactCollapsingTable from 'react-collapsing-table';
import Checkboxes from '../components/Checkboxes';
import NameForm from "./NameForm.js";
import { Button } from 'react-bootstrap';
import { downloadAttendanceCSV, compareActivities } from '../components/Helpers';

class Attendance extends React.Component {

    async componentDidMount() {
        try {
            const today = new Date();
            const rawStudents = await fetch('http://127.0.0.1:8000/api/students');
            const rawAttendance = await fetch(`http://127.0.0.1:8000/api/attendance?day=${`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`}`);
            const rawActivities = await fetch('http://127.0.0.1:8000/api/activities');
            const students = await rawStudents.json();
            const attendanceItems = await rawAttendance.json();
            const activities = await rawActivities.json();
            activities.sort(compareActivities)

            // Combine attendance items. Need to sort by student id.
            var entries = {};
            for (var i = 0; i < attendanceItems.length; i++) {
                if (entries[`${attendanceItems[i].student_id}`] == null) {
                    entries[`${attendanceItems[i].student_id}`] = {'time':attendanceItems[i].time};
                }
                entries[`${attendanceItems[i].student_id}`][attendanceItems[i].activity_id] = {'value':true, 'itemID':attendanceItems[i].id};
            }

            // Build table of the form [{name, activity1, ... , activityn, time}]
            var sheet = [];
            const ids = Object.keys(entries);
            var columns = ['Name'];
            for (var i = 0; i < activities.length; i++) {
                columns.push(activities[i].name);
            }
            for (var i = 0; i < ids.length; i++) {
                var row = {}
                // match student data to current id
                for (var j = 0; j < students.length; j++) { // unfortunately, student data isn't in any particular order. O(n) it is!
                    if (students[j].id == ids[i]) {
                        row['name'] = `${students[j].first_name} ${students[j].last_name}`;
                        row['studentID'] = students[j].id;
                        break;
                    }
                } 
                row['time'] = entries[ids[i]].time;
                row['activities'] = {};
                // fill in activities data
                for (var j = 0; j < activities.length; j++) {
                    row['activities'][activities[j].name] = {
                        'value': (entries[ids[i]][activities[j].activity_id]) ? true : false,
                        'activityID': activities[j].activity_id,
                        'attendanceItemID': (entries[ids[i]][activities[j].activity_id]) ? entries[ids[i]][activities[j].activity_id].itemID : 0,
                    }
                }
                sheet.push(row)
            }

            this.setState({
                attendance: sheet
            });

        } catch (e) {
            console.log(e);
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            buildingCSV: false,
            attendance: [],
        }

        this.downloadCSV = this.downloadCSV.bind(this);
    }

    downloadCSV() {
        const today = new Date()
        this.setState({ buildingCSV: true });
        downloadAttendanceCSV(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        this.setState({ buildingCSV: false });
    }

    render() {
         const rows = this.state.attendance.map(item =>
             (
                {
                    name: item.name,
                    time: item.time,
                    activities: item.activities,
                    studentID: item.studentID
                }));

         const columns = [
             {
                accessor: 'name',
                label: 'Name',
                priorityLevel: 1,
                position: 1,
                minWidth: 100
            },
            {
                accessor: 'time',
                label: 'Check-in Time',
                priorityLevel: 2,
                position: 2,
                minWidth: 100},
            { 
                accessor: 'activities',
                label: 'Activities',
                priorityLevel: 3,
                position: 3,
                minWidth: 2000,
                CustomComponent: Checkboxes,
                sortable: false, 
            }
        ];

        const buildingCSV = this.state.buildingCSV;
        const today = new Date()

        return (
            <div className='content'>
                <h1>Attendance for {today.getFullYear()}-{today.getMonth() + 1}-{today.getDate()}</h1>
                <br/>
                <Button style={{ float: 'right'}} onClick={this.downloadCSV} disabled={buildingCSV}>{buildingCSV ? 'Downloading...' : 'Download'}</Button>
                <NameForm />
                <ReactCollapsingTable
                        rows = { rows }
                        columns = { columns }
                        showPagination={ true }
                />
            </div>
        )
    }
}

export default Attendance;