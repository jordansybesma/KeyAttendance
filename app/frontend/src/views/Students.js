import React, { Component } from 'react';
import Autocomplete from '../components/Autocomplete';
import { Label } from 'react-bootstrap';

class Students extends Component {
  state = {
    key: [],
    mode: 'search'
  }

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
  }

  async componentDidMount() {
  /**  try {
      var id = window.location.href.replace("http://localhost:3000/students", "");   // This feels wrong...
      if (id && id !== "/") {   // Need to decide if pages will have trailing slash or not
        const res = await fetch('http://127.0.0.1:8000/api/students' + id);
        const key = await res.json();
        this.setState({
          key,
          mode: 'display',
		  id
        });
      } else {
	  **/
        const res = await fetch('http://127.0.0.1:8000/api/');
        var studentDatabase = await res.json();
        studentDatabase = this.makeSuggestionsArray(studentDatabase);
        this.setState({
          studentDatabase,
          mode: 'search'
		}); 
      /**}
    } catch (e) {
      console.log(e);
    }**/
  }

  makeSuggestionsArray(key) {
    var array = [];

    for (var object in key) {
      var fullName = (key[object]['first_name'] + ' ' + key[object]['last_name']);
      array.push({name: fullName, id: key[object]['id']});
    }

    return array;
  }

  handler(e, studentId) {
	this.setState({
		mode: 'display',
		id: studentId
	});
    window.location.href = "http://localhost:3000/students/" + studentId; 
    //this.componentDidMount();
  }

async getStudentProfile(){
	try {
	const res = await fetch('http://127.0.0.1:8000/api/students/' + this.state.id);
	const studentProfileData = await res.json();
	this.studentProfileData = studentProfileData;
	}
	catch(e){
		console.log(e);
	}
}

render() {
    if(this.state.mode === "search"){
      return (
        <div className='content'>
          <h1> Key Students </h1>
          <Autocomplete
            suggestions={this.state.studentDatabase}
            handler={this.handler}
          />
        </div>
      );
    }else{
		this.getStudentProfile();
      return (
        <div className='content'>
        <h1> Student Profile </h1>
        <div>
          Name: {this.state.studentProfileData.first_name} {this.state.studentProfileData.last_name} <br />
          ID: <Label>{this.state.studentProfileData.id}</Label> <br />
          First Attendance: {this.state.studentProfileData.first_attendance} <br />
          Number of Visits: {this.state.studentProfileData.number_visits}
        </div>
      </div>
      );
    }
  }
}

export default Students;
