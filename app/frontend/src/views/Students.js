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
      formData: {
        'firstName': '',
        'lastName': '',
        'id': '',
        'firstAttendance': '',
        'numVisits': '',
      }
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
          formData: {
            'firstName': '',
            'lastName': '',
            'id': '',
            'firstAttendance': '',
            'numVisits': '',
          }
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
      state.formData = {
        'firstName': state.profileData.first_name,
        'lasName': state.profileData.last_name,
        'id': state.profileData.id,
        'firstAttendance': state.profileData.first_attendance,
        'numVisits': state.profileData.number_visits
      }
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
    state.formData[changedField] = evt.target.value;
    this.setState(function (previousState, currentProps) {
      return state;
    });
  }
  
  handleSubmit(evt, state) {
    // evt.preventDefault()
    httpPatch('http://127.0.0.1:8000/api/students/', {
            'first_name': state.formData['firstName'],
            'last_name': state.formData['lastName'],
            'id': state.profileData.id,
            'first_attendance': state.formData['firstAttendance'],
            'number_visits': state.formData['numVisits']
            }
    );
    //this.setState({mode: 'display'})
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
              First Name: <input type="text" id="firstName" defaultValue={this.state.profileData.first_name} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Last Name: <input type="text" id="lastName" defaultValue={this.state.profileData.last_name} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              ID: <input type="text" id="id" defaultValue="N/A" onChange={evt => this.handleChange(evt, this.state)} /> <br/>
              Birthday: <input type="text" defaultValue="xx/xx/xxxx" onChange={this.handleChange} /> <br/>
              Nickname: <input type="text" defaultValue="N/A" onChange={this.handleChange} /> <br/>
              Gender: <input type="text" defaultValue="N/A" onChange={this.handleChange} /> <br/>
              First Attendance: <input type="text" id="firstAttendance" defaultValue={this.state.profileData.first_attendance} onChange={evt => this.handleChange(evt, this.state)} /> <br/>
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
