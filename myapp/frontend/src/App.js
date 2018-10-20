import React, { Component } from 'react';

class App extends Component {
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
        <h1> Key Youths </h1>
        {this.state.key.map(item => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <span>Key: {item.key.toString()}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
