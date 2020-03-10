import React from "react";
import '../Styling/Style.css';

const SignUp = () => {
  return (
    <div>
      <h3 className="center">Welcome to the scoring app. Please Sign Up!</h3>
      <div className="container">
      <form id="form" class="form">
        <h2>Register With Us!</h2>
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
        <button>Submit</button>
      </form>
    </div>
    </div>
  );
};

export default SignUp;
