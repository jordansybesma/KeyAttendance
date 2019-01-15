import React, { Component } from 'react';
import Autocomplete from '../components/Autocomplete';
import Heatmap from '../components/Heatmap';
import { Label } from 'react-bootstrap';
import LabeledHeatmap from '../components/Heatmap';

class Students extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'search',
      studentsJson: {},
      suggestionsArray: [],
      id: null,
      profileData: {},
      heatMapJson: {}
    };
    this.handler = this.handler.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/');
      var studentsJson = await res.json();
      var suggestionsArray = this.makeSuggestionsArray(studentsJson);
      
      this.setState(function (previousState, currentProps) {
        return {
          mode: 'search',
          studentsJson: studentsJson,
          suggestionsArray: suggestionsArray,
          id: null,
          profileData: {},
          heatMapJson: {}
        };
      });
    } catch (e) {
      console.log(e);
    }
  }

  makeSuggestionsArray(suggestions) {
    var array = [];
    var lastHolder1;
    var lastHolder2;
    var tempArray;
    for (var object in suggestions) {
      if (suggestions[object]['last_name'].includes(" ")) {
        tempArray = suggestions[object]['last_name'].split(" ");
        lastHolder1 = tempArray[0];
        lastHolder2 = tempArray[1];
      }
      else {
        lastHolder1 = suggestions[object]['last_name'];
        lastHolder2 = "";
      }
      array.push({
        firstName: suggestions[object]['first_name'],
        lastName1: lastHolder1,
        lastName2: lastHolder2,
        id: suggestions[object]['id']
      });
    }
    return array;
  }

  handler(e, studentId) {
    var state = {
      mode: 'display',
      id: studentId
    };
    this.getStudentProfile(state);
  }

  async getStudentProfile(state) {
    try {
      const studentProfileData = await fetch('http://127.0.0.1:8000/api/students/' + state.id);
      const studentProfileJson = await studentProfileData.json();
      state.profileData = studentProfileJson;

      console.log("Hit the endpoint with studentid=906, startdate=2018-01-28, enddate=2018-03-03");
      var studentId = "906";
      var startDateString = "2018-01-28";
      var endDateString = "2018-03-03";
      const heatMapData = await fetch('http://127.0.0.1:8000/api/reports/individualHeatmap/?student_id=' + studentId + '&startdate=' + startDateString + '&enddate=' + endDateString);
      state.heatMapJson = await heatMapData.json();
      console.log(state.heatMapJson);

      this.setState(function (previousState, currentProps) {
        return state;
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.mode === 'search') {
      return (
        <div className='content'>
          <h1> Key Students </h1>
			  	<div className='container-fluid no-padding'>
					<div className='row justify-content-start'>
				  		<div className='col-md-12 to-front top-bottom-padding'>
							<Autocomplete
								suggestions={this.state.suggestionsArray}
								handler={this.handler}
						  	/>
		  				</div>
		  			</div>
		  		</div>  
        </div>
      );
    } else if (this.state.mode === 'display') {
      
      return (
        <div className='content'>
          <h1> Student Profile </h1>
		  <div className='container-fluid no-padding'>
  			<div className='row justify-content-start'>
			  <div className='col-md-4 to-front top-bottom-padding'>
				  <Autocomplete
					suggestions={this.state.suggestionsArray}
					handler={this.handler}
				  />
			  </div>
			  <div className='col-md-8 top-bottom-padding'>
				Name: {this.state.profileData.first_name} {this.state.profileData.last_name} <br/>
                ID: <Label>N/A</Label> <br/>
                Birthday: xx/xx/xxxx <br/>
                Nickname: N/A <br/>
                Gender: N/A <br/>
                First Attendance: {this.state.profileData.first_attendance} <br/>
                Number of Visits: {this.state.profileData.number_visits} <br/>
			  </div>
        	</div>
		  </div>
      <LabeledHeatmap 
        heatMapJson = {this.state.heatMapJson}/>
		</div>
      );
    }
  }
}

export default Students;
