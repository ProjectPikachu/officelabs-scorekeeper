import React from "react";

const NewGame = () => {
  return (
    <div>
      <h3 className="center">Enter Game Results</h3>
      <div id="NewGame" className="NewGame-container">
        <form id="NewGame-form" class="NewGame-form">
          <div className="form-control">
            <label for="full-name">Player1</label>
            <input type="text" id="username" placeholder="Enter Player1 username" />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="password">Player1 Score</label>
            <input type="text" id="Player1-score" placeholder="Enter Player1 score" />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="username">Player2</label>
            <input type="text" id="username" placeholder="Enter player2 username" />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="password2">Player2 Score</label>
            <input
              type="text"
              id="Player2-score"
              placeholder="Enter Player2 score"
            />
            <small>Error message</small>
          </div>
          <button type = 'submit' value = 'submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewGame;