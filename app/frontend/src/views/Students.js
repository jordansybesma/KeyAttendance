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
    try {
      var id = window.location.href.replace("http://localhost:3000/students/", "");   // This feels wrong...
      if (id) {
        const res = await fetch('http://127.0.0.1:8000/api/students/' + id);
        const key = await res.json();
        this.setState({
          key,
          mode: 'display'
        });
      } else {
        const res = await fetch('http://127.0.0.1:8000/api/');
        var key = await res.json();
        key = this.makeSuggestionsArray(key);
        this.setState({
          key,
          mode: 'search'}) 
      }
    } catch (e) {
      console.log(e);
    }
  }

  makeSuggestionsArray(key) {
    var array = [];

    for (var object in key) {
      var fullName = (key[object]['first_name'] + ' ' + key[object]['last_name']);
      array.push(fullName);
    }
    console.log(array);
    return array;
  }

  handler(e) {
    var id = "906";   // This needs to be dynamic
    window.location.href = "http://localhost:3000/students/" + id;
    this.componentDidMount();
  }

  render() {
    if(this.state.mode === "search"){
      return (
        <div className='content'>
          <h1> Key Students </h1>
          <Autocomplete
            suggestions={this.state.key}
            handler={this.handler}
          />
        </div>
      );
    }else{
      return (
        <div className='content'>
        <h1> Student Profile </h1>
        <div>
          Name: {this.state.key.first_name} {this.state.key.last_name} <br />
          ID: <Label>{this.state.key.id}</Label> <br />
          First Attendance: {this.state.key.first_attendance} <br />
          Number of Visits: {this.state.key.number_visits}
        </div>
      </div>
      );
    }
  }
}

export default Students;
