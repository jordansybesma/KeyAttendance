import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { httpGet, protocol, domain, downloadReportsCSV } from './Helpers';

class AttendanceByProgramReport extends React.Component {
    constructor(props) {
    	super(props);
  
      	this.state = {
        	activities: [],
			activityDropdownSelected: "",
			buildingCSV: false,
			startDate: "",
			endDate: "",
		};

		this.handleActivityDropdownSelect = this.handleActivityDropdownSelect.bind(this);
		this.updateEndDate = this.updateEndDate.bind(this);
		this.updateStartDate = this.updateStartDate.bind(this);
		this.downloadCSV = this.downloadCSV.bind(this);
	}

	async downloadCSV() {
		if (this.state.dateOne === "" || this.state.dateTwo === "") {
		  return
		}
		this.setState({ buildingCSV: true });
		await downloadReportsCSV();
		this.setState({ buildingCSV: false });
	}

	updateStartDate(e) {
    	this.setState({startDate: e.target.value});
    }

    updateEndDate(e) {
    	this.setState({endDate: e.target.value});
    }

	async componentDidMount() {
		const activities = await httpGet(`${protocol}://${domain}/api/activities/`);
        this.setState({activities: activities, activityDropdownSelected: activities[0].name});
	}

	handleActivityDropdownSelect(e) {
    	this.setState({activityDropdownSelected: e.target.value});
    }
	
	render() {
		const activityList = this.state.activities.map((item, i) => <option value={item.name} key={`item${i}`}>{item.name}</option>)
		const {buildingCSV} = this.state;

		return (
			<div>
				<h3> Attendance by Program </h3>
				<br/>
                <Form inline style={{paddingRight: '5px', paddingLeft: '5px'}}>
                  <FormGroup>
                    <ControlLabel>Program: </ControlLabel>{' '}
                    <FormControl componentClass="select" 
                      name="type" 
                      onChange={this.handleActivityDropdownSelect}
                      defaultValue="string"
                    >
                      {activityList}
                    </FormControl>{'  '}
                    <ControlLabel>Start Date</ControlLabel>{' '}
                    <FormControl onChange={this.updateStartDate} value={this.state.startDate} type="date"/>{'  '}
                    <ControlLabel>End Date</ControlLabel>{' '}
                    <FormControl onChange={this.updateEndDate} value={this.state.endDate} type="date"/>{'  '}
                    <Button onClick={this.downloadCSV} disabled={buildingCSV}>{buildingCSV ? 'Downloading...' : 'Download'}</Button>
                  </FormGroup>
                </Form>
			</div>
		);
	}
}

export default AttendanceByProgramReport;
