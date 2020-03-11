import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-wrapper indigo">
      <div className="container">
        <a className="brand-logo left"> Office Scoreboard </a>
        <ul className="right">
          <li>
            <Link to="/">Leaderboard</Link>
          </li>
          <li>
            <Link to="/NewGame"> New Game </Link>
          </li>
          <li>
            <Link to="/SignIn"> Sign In</Link>
          </li>
          <li>
            <Link to="/SignUp">Sign Up</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default NavBar;
