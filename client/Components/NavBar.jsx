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
            <Link to="/NewGame"> NewGame </Link>
          </li>
          <li>
            <Link to="/SignIn"> SignIn</Link>
          </li>
          <li>
            <Link to="/SignUp">SignUp</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default NavBar;
