import React from 'react';
import { Button } from 'react-bootstrap';
import { downloadAttendanceCSV } from '../components/Helpers';

class Attendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buildingCSV: false
        }

        this.downloadCSV = this.downloadCSV.bind(this);
    }

    downloadCSV() {
        const today = new Date()
        this.setState({ buildingCSV: true });
        downloadAttendanceCSV('2018-02-13') // `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        this.setState({ buildingCSV: false });
    }
    
    render() {
        const buildingCSV = this.state.buildingCSV;
        return (
            <div className='content'>
                <p>Attendance</p>
                <Button onClick={this.downloadCSV} disabled={buildingCSV}>{buildingCSV ? 'Downloading...' : 'Download'}</Button>
            </div>
        );
    }
}

export default Attendance;