import React, { Component } from 'react';
import { Label } from 'react-bootstrap';

class Students extends Component {
  state = {
    key: []
  }

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/');
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
        {this.state.key.map(item => (
          <div key={item.id}>
            <h2>{`${item.first_name} ${item.last_name}`} <Label>{item.id.toString()}</Label></h2>
          </div>
        ))}
      </div>
    );
  }
}

export default Students;