import React from "react";
import "../Styling/Style.css";

const SignUp = (props) => {
  return (
    <div>
      <h3 className="center">Welcome to the scoring app. Please Sign Up!</h3>
      <div id="SignUp" className="SignUp-container">
        <form id="SignUp-form" className="SignUp-form" onSubmit={props.onSignUpSubmit}>
          <div className="form-control">
            <label for="full-name">Full Name</label>
            <input type="text" id="full-name" placeholder="Enter full name" />
            <small>Error message</small>
          </div>
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
          <div className="form-control">
            <label for="password2">Confirm Password</label>
            <input
              type="text"
              id="password2"
              placeholder="Enter password again"
            />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="cohort">Cohort</label>
            <input type="text" id="cohort" placeholder="Enter Your Cohort" />
            <small>Error message</small>
          </div>
          <button id="SignUp-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
