import React from "react";
import "../Styling/Style.css";
import { Redirect } from "react-router-dom";

const SignIn = props => {
  console.log(props.isLogged);
  if (props.isLogged === true) {
    return <Redirect to="/NewGame" />;
  }
  return (
    <div>
      <h3 className="center">Please Sign In</h3>
      <div className="SignUp-container">
        <form
          id="SignIn-form"
          className="SignIn-form"
          onSubmit={props.onSignInSubmit}
        >
          <link rel="stylesheet" href="../Styling/Style.css" />
          <div className="form-control">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Enter username" />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="password">Password</label>
            <input type="text" id="password" placeholder="Enter password" />
            <small>Error message</small>
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
