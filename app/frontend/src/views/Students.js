import React, { Component } from 'react';
import Autocomplete from '../components/Autocomplete';
import { Label } from 'react-bootstrap';

class Students extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'search',
      studentsJson: {},
      suggestionsArray: [],
      id: null,
      profileData: {}
    };
    this.handler = this.handler.bind(this);
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.mode === "display") {
      this.setState(function(previousProps, previousState) {
        return { mode: "search" };
      })
    }
  }

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/');
      var studentsJson = await res.json();
      var suggestionsArray = this.makeSuggestionsArray(studentsJson);
      this.setState(function(previousState, currentProps) {
        return {
          mode: 'search',
          studentsJson: studentsJson,
          suggestionsArray: suggestionsArray,
          id: null,
          profileData: {}
        };
      });
    } catch (e) {
      console.log(e);
    }
  }

  makeSuggestionsArray(suggestions) {
    var array = [];
    for (var object in suggestions) {
      array.push({firstName: suggestions[object]['first_name'],
                  lastName: suggestions[object]['last_name'],
                  id: suggestions[object]['id']});
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
      this.setState(function (previousState, currentProps) {
        return state;
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.mode === "search") {
      return (
        <div className='content'>
          <h1> Key Students </h1>
          <Autocomplete
            suggestions={this.state.suggestionsArray}
            handler={this.handler}
          />
        </div>
      );
    } else if (this.state.mode === "display") {
      return (
        <div className='content'>
          <h1> Student Profile </h1>
          {/* <Autocomplete
            suggestions={this.state.suggestionsArray}
            handler={this.handler}
          /> */}
          <div>
            Name: {this.state.profileData.first_name} {this.state.profileData.last_name} <br />
            ID: <Label>{this.state.profileData.id}</Label> <br />
            First Attendance: {this.state.profileData.first_attendance} <br />
            Number of Visits: {this.state.profileData.number_visits}
          </div>
        </div>
      );
    }
  }
}

export default Students;
