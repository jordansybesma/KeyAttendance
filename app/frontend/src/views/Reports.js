import React from 'react';
import LabeledHeatmap from '../components/Heatmap';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';

class Reports extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          byHourJson: {}
        };
      }
    
      async componentDidMount() {
        try {
            const byHourAttendanceData = await fetch('http://127.0.0.1:8000/api/reports/byHourAttendance/?startdate=' + "2018-01-28" + '&enddate=' + "2018-03-03");
          var byHourJson = await byHourAttendanceData.json();
          console.log(byHourJson);
          
          this.setState(function (previousState, currentProps) {
            return {
              byHourJson: byHourJson
            };
          });
        } catch (e) {
          console.log(e);
        }
      }

    render() {
        return (
            <div className='content'>
                <p>Reports</p>
            </div>
        );
    }
}

export default Reports;