const { Pool } = require('pg');

let cstring = 'postgresql://gkdkscwo:OEIF6xvG7T5duXS_7GlrCdGOLZt6lDsK@rajje.db.elephantsql.com:5432/gkdkscwo';

// If testing environemnt, change cString to testing uri
if (process.env.NODE_ENV === 'test') {
  cstring = 'postgres://kkmfuxxw:8aojLeJ5SAfRdWqq4L-_m0247lneI0ex@drona.db.elephantsql.com:5432/kkmfuxxw';
}

const gameContoller = {
  addGame: async (req, res, next) => {
    // console.log(req.body);
    // const authCookie = req.cookie('Auth');

    const pool = new Pool({ connectionString: cstring });

    try {
      const queryString = `
        INSERT INTO Games 
        (WinnerName, LoserName, WinnerPoints, LoserPoints, WinnerConfirm, LoserConfirm, posting_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`;

      const {
        yourUsername, opponentUsername, yourPoints, opponentPoints, gameDate,
      } = req.body;

      // console.log(req.body);

      let winnerName;
      let loserName;
      let winnerPoints;
      let loserPoints;
      let winnerConfirm;
      let loserConfirm;

      // define winner and loser
      if (yourPoints > opponentPoints) {
        winnerName = yourUsername;
        winnerPoints = yourPoints;
        loserName = opponentUsername;
        loserPoints = opponentPoints;
        winnerConfirm = true;
        loserConfirm = false;
      } else {
        winnerName = opponentUsername;
        winnerPoints = opponentPoints;
        loserName = yourUsername;
        loserPoints = yourPoints;
        winnerConfirm = false;
        loserConfirm = true;
      }

      const params = [
        winnerName,
        loserName,
        winnerPoints,
        loserPoints,
        winnerConfirm,
        loserConfirm,
        gameDate,
      ];
      // console.log(process.env.NODE_ENV);
      // console.log(params);
      // const games = await pool.query('Select * From Games');
      // const users = await pool.query('Select * From Users');
      // const user = await pool.query('Select * From U');
      // console.log('Users: ', users);

      const response = await pool.query(queryString, params);
      // console.log('after response');
      // pool.end();
      // console.log('Add Game Response: ', response);
      pool.end();
      return next();
    } catch (err) {
      // console.log(response);
      // console.log('ERROR: ', err);
      pool.end();
      return next({ message: { err: 'Unable to add game' } });
    } finally {
      // pool.end();
    }
  },
  allUsers: async (req, res, next) => {
    const pool = new Pool({ connectionString: cstring });

    // try to get all users
    // if fails- catch and send global err

    try {
      const queryString = 'Select username, fullname from Users;';

      const getUsers = await pool.query(queryString);

      res.locals.allUsers = getUsers.rows;
      return next();
    } catch (err) {
      return next({ message: { err: 'Unable to get Users' } });
    } finally {
      pool.end();
    }
  },
  getPending: async (req, res, next) => {
    const pool = new Pool({ connectionString: cstring });

    try {
      const queryStringNeedingApproval = `
        SELECT * FROM Games 
        WHERE winnername=$1 AND winnerconfirm=$2
        UNION
        SELECT * FROM Games 
        WHERE losername=$1 AND loserconfirm=$2
      `;
      const queryStringWaitingApproval = `
        SELECT * FROM Games 
        WHERE winnername=$1 AND winnerconfirm=$2 AND loserconfirm=$3
        UNION
        SELECT * FROM Games 
        WHERE losername=$1 AND loserconfirm=$2 AND winnerconfirm=$3
      `;
      const paramsNeedingApproval = [res.locals.username, false];
      const paramsWaitingApproval = [res.locals.username, true, false];

      // get the user's actual name
      // console.log(res.locals.username);

      // get all games where the user is confirm = true
      const responseNeedApproval = await pool.query(queryStringNeedingApproval, paramsNeedingApproval);

      // get all games where the user is confirm = false
      const responseWaitingApproval = await pool.query(queryStringWaitingApproval, paramsWaitingApproval);

      // console.log(responseNeedApproval.rows);
      // console.log(responseWaitingApproval.rows);

      res.locals.needsApproval = responseNeedApproval.rows;
      res.locals.waitingOnApproval = responseWaitingApproval.rows;

      // store objects on res.locals
    } catch (err) {
      return next({ message: { err: 'Unable to get Pending Games' } });
    } finally {
      pool.end();
    }

    next();
  },
  leaderboard: async (req, res, next) => {
    const pool = new Pool({ connectionString: cstring });
    try {
      const queryString = `
        SELECT WinnerName as username, COUNT (WinnerName) as Wins
        FROM Games
        WHERE WinnerConfirm = true and LoserConfirm = true
        GROUP BY username
        ORDER BY Wins`;

      let leaderboard = await pool.query(queryString);
      leaderboard = leaderboard.rows;

      const finalBoard = {};

      for (let i = 0; i < leaderboard.length; i += 1) {
        finalBoard[i + 1] = leaderboard[i];
      }


      res.locals.leaderboard = finalBoard;

      return next();
    } catch (err) {
      console.log(err);
      return next({ message: { err: 'Unable to get Leaderboard' } });
    } finally {
      pool.end();
    }
  },
  patchGame: async (req, res, next) => {
    const pool = new Pool({ connectionString: cstring });

    const { gameid } = req.body;

    try {
      const queryString = `UPDATE Games
      SET winnerconfirm  = 'true', loserconfirm= 'true'
      WHERE gameid = $1;`;

      await pool.query(queryString, [gameid]);

      return next();
    } catch (err) {
      return next();
    } finally {
      pool.end();
    }
  },
};

module.exports = gameContoller;
