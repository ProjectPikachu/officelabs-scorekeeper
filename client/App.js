// All routing will happen here
import React, { Component } from "react";
import NavBar from "./Components/NavBar.jsx";
import Leaderboard from "./Components/Leaderboard.jsx";
import NewGame from "./Components/NewGame.jsx";
import SignIn from "./Components/SignIn.jsx";
import SignUp from "./Components/SignUp.jsx";
import { BrowserRouter as Router, Route} from "react-router-dom";


// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
class App extends Component {
    constructor(){
        super()
        this.state = {
            name1: 'Alex',
            name2: 'Raymond'
        };
    }
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Leaderboard}/>
          <Route path="/NewGame" component={NewGame} />
          <Route path="/SignIn" component={SignIn} />
          <Route path="/SignUp" component={SignUp} />
        </div>
      </Router>
    );
  }
}

export default App;
