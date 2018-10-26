import React, { Component } from 'react';
import { Label } from 'react-bootstrap';

class Students extends Component {
  state = {
    key: []
  }

  async componentDidMount() {
    try {
      var id = window.location.href.replace("http://localhost:3000/students/", "");
      const res = await fetch('http://127.0.0.1:8000/api/' + id);
      const key = await res.json();
      this.setState({
        key
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className='content'>
        <h1> Key Students </h1>
          Name: {this.state.key.first_name} {this.state.key.last_name} <br />
          ID: <Label>{this.state.key.id}</Label> <br />
          First Attendance: {this.state.key.first_attendance} <br />
          Number of Visits: {this.state.key.number_visits}
      </div>
    );
  }
}

export default Students;
