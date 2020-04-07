import React from 'react';
import Leaderboard from './Leaderboard';

class App extends React.Component
{
  render(){
    return (
      <div id='content'>
        <h1>GitHub Leaderboard</h1>
        <Leaderboard/>
      </div>
    );
  }
}

export default App;