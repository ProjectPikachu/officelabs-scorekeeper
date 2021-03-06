// All routing will happen here
import React, { Component } from "react";
import NavBar from "./Components/NavBar.jsx";
import Leaderboard from "./Components/Leaderboard.jsx";
import NewGame from "./Components/NewGame.jsx";
import SignIn from "./Components/SignIn.jsx";
import SignUp from "./Components/SignUp.jsx";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
class App extends Component {
  constructor() {
    super();
    this.state = {
      winnerID: "",
      loserID: "",
      winnerPoints: null,
      loserPoints: null,
      winnerConfirm: null,
      loserConfirm: null,
      fullName: "",
      username: "",
      password: "",
      cohort: null,
      isLogged: false
    };
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
    this.onSignInSubmit = this.onSignInSubmit.bind(this);
    this.onNewGameSubmit = this.onNewGameSubmit.bind(this);
  }

  // method for SignUp submit
  onSignUpSubmit(e) {
    e.preventDefault();
    const fullName = e.target[0].value;
    const username = e.target[1].value;
    const password = e.target[2].value;
    const cohort = e.target[4].value;

    console.log({
      Fullname: fullName,
      Username: username,
      Password: password,
      Cohort: cohort
    });

    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Fullname: fullName,
        Username: username,
        Password: password,
        Cohort: 16
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("hitting signUpSubmit");
        this.setState({
            username: response.Username
        })
        console.log(this.state);
      })
      .catch(error => {
        console.log("hitting signUpSubmit error");
        console.log("Error", error);
      });
  }

  onSignInSubmit(e) {
    e.preventDefault();
    this.setState({
      isLogged: true
    });
    const username = e.target[0].value;
    const password = e.target[1].value;
    fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Username: username,
        Password: password
      })
    })
      .then(response => response.json())
      .then(response => {
        // now store username in state
        console.log(response)
      })
      .catch(error => {
        console.log(this.state);
        console.log("Error in SignInSubmit ", error);
      });
  }

  onNewGameSubmit(e) {
    e.preventDefault();
    const player1 = e.target[0].value;
    const player1score = e.target[1].value;
    const player2 = e.target[2].value;
    const player2score = e.target[3].value;

    console.log("e.target:  ", e.target[0].value);

    fetch("/game/addgame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1,
        player1score,
        player2,
        player2score
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Route
            exact
            path="/"
            render={props => <Leaderboard {...props} props={this.state} />}
          />
          <Route
            path="/NewGame"
            render={props => (
              <NewGame {...props} onNewGameSubmit={this.onNewGameSubmit} />
            )}
          />
          <Route
            path="/SignIn"
            render={props => (
              <SignIn
                {...props}
                onSignInSubmit={this.onSignInSubmit}
                isLogged={this.state.isLogged}
              />
            )}
          />
          <Route
            path="/SignUp"
            render={props => (
              <SignUp {...props} onSignUpSubmit={this.onSignUpSubmit} />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
