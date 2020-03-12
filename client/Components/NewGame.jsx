import React from "react";

const NewGame = props => {
  return (
    <div>
      <h3 className="center">Enter Game Results</h3>
      <div id="NewGame" className="NewGame-container">
        <form
          id="NewGame-form"
          class="NewGame-form"
          onSubmit={props.onNewGameSubmit}
        >
          <div className="form-control">
            <label for="password">Your Score</label>
            <input
              type="text"
              id="yourPoints"
              placeholder="Enter your score here"
            />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="username">Opponent</label>
            <input
              type="text"
              id="opponentUsername"
              placeholder="Enter opponent username"
            />
            <small>Error message</small>
          </div>
          <div className="form-control">
            <label for="password2">Opponent Score</label>
            <input
              type="text"
              id="opponentPoints"
              placeholder="Enter opponent score"
            />
            <small>Error message</small>
          </div>
          <button type="submit" value="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewGame;
