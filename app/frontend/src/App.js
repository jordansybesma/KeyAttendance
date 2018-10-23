import React, { Component } from 'react';
import Layout from './components/Layout';
import Router from './components/Router';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Router/>
        </Layout>
      </div>
    );
  }
}

export default App;
