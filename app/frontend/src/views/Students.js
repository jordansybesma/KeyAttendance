import React, { Component } from 'react';

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
      <div>
        <h1> Key Students </h1>
        {this.state.key.map(item => (
          <div key={item.id}>
            <h2>{`${item.first_name} ${item.last_name}`}</h2>
            <span>id: {item.id.toString()}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default Students;
