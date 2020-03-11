import React from "react";

function Leaderboard (props) {
  
  return (
    <div className="container">
      <h3 className="center">Leaderboard</h3>
      <p>Hi {props.props.fullName}</p>
    </div>
  );
};

export default Leaderboard;
