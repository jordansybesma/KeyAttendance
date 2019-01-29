import React, { Component } from 'react';
import Autocomplete from '../components/Autocomplete';
import { Label } from 'react-bootstrap';
import { httpGet, httpPatch } from '../components/Helpers';

class Students extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'search',
      studentsJson: {},
      suggestionsArray: [],
      id: null,
      profileData: {},
    };
    this.edit = this.edit.bind(this);
    this.handler = this.handler.bind(this);
  }

  async componentDidMount() {
    try {
      var studentsJson = await httpGet('http://127.0.0.1:8000/api/students');
      var suggestionsArray = this.makeSuggestionsArray(studentsJson);
      this.setState(function (previousState, currentProps) {
        return {
          mode: 'search',
          studentsJson: studentsJson,
          suggestionsArray: suggestionsArray,
          id: null,
          profileData: {},
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
      const studentProfileJson = await httpGet('http://127.0.0.1:8000/api/students?id=' + state.id);
      state.profileData = studentProfileJson;
      this.setState(function (previousState, currentProps) {
        return state;
      });
    }
    catch (e) {
      console.log(e);
    }
  }
  
  edit() {
    this.setState({mode: 'edit'})
  }
  
  handleChange(evt, state) {
    var changedField = evt.target.id;
    state.profileData[changedField] = evt.target.value;
    this.setState(function (previousState, currentProps) {
      return state;
    });
  }
  
  handleSubmit(evt, state) {
    evt.preventDefault()
    httpPatch('http://127.0.0.1:8000/api/students/', state.profileData);

    // Ensure that the autocomplete component has an updated copy of the profile
    var entryFound = false;
    var entryIndex = 0;
    while (entryFound === false) {
      if (state.suggestionsArray[entryIndex].id === state.profileData['id']) {
        state.suggestionsArray[entryIndex] = {firstName: state.profileData['first_name'],
                                              id: state.profileData['id'],
                                              lastName1: state.profileData['last_name'],
                                              lastName2: ''};
        entryFound = true
      } else {
        entryIndex++;
      }
    }

    state.id = state.profileData.id;
    state.mode = 'display';

    this.setState(function (previousState, currentProps) {
      return state;
    });
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
                Student ID: {this.state.profileData.student_id} <br/>
                Birthday: {this.state.profileData.birthday} <br/>
                Nickname: {this.state.profileData.nickname} <br/>
                Gender: {this.state.profileData.gender} <br/>
                First Attendance: {this.state.profileData.first_attendance} <br/>
                Number of Visits: {this.state.profileData.number_visits} <br/>
                <button onClick={this.edit}>
                  Edit
                </button>
			  </div>
        	</div>
		  </div>
		</div>
      );
    }
    else if (this.state.mode === 'edit') {
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
              <form className='col-md-8 top-bottom-padding' onSubmit={evt => this.handleSubmit(evt, this.state)}>
              First Name: <input type="text" id="first_name" defaultValue={this.state.profileData.first_name} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Last Name: <input type="text" id="last_name" defaultValue={this.state.profileData.last_name} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Student ID: <input type="text" id="student_id" defaultValue={this.state.profileData.student_id} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Birthday: <input type="date" id="birthday" defaultValue={this.state.profileData.birthday} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Nickname: <input type="text" id="nickname" defaultValue={this.state.profileData.nickname} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Gender: <input type="text" id="gender" defaultValue={this.state.profileData.gender} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              First Attendance: <input type="date" id="firstAttendance" defaultValue={this.state.profileData.first_attendance} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Number of Visits: <input type="text" id="numVisits" defaultValue={this.state.profileData.number_visits} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              <input type="submit" value="Submit" />
              </form>
          </div>
        	</div>
		  </div>
		</div>
      );
    }
  }
}

export default Students;
