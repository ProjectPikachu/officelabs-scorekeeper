const bcrypt = require("bcrypt");

// const { query, closePool } = require('../models/index');
const { Pool } = require("pg");

let cstring =
  "postgresql://gkdkscwo:OEIF6xvG7T5duXS_7GlrCdGOLZt6lDsK@rajje.db.elephantsql.com:5432/gkdkscwo";

// If testing environemnt, change cString to testing uri
if (process.env.NODE_ENV === "test") {
  cstring =
    "postgres://kkmfuxxw:8aojLeJ5SAfRdWqq4L-_m0247lneI0ex@drona.db.elephantsql.com:5432/kkmfuxxw";
}

const saltRounds = 10;

const authController = {
  signUp: (req, res, next) => {
    // console.log(req.body);
    // console.log('signup');
    // Destructued the Req Body
    const { Username, Password, Cohort, Fullname } = req.body;

    // console.log('Req.body: ', req.body);

    // Query String
    const queryString = `INSERT INTO Users (Username, Password, Cohort, Fullname, AuthCookie)
    Values ($1, $2, $3, $4, $5)
    RETURNING *`;

    // Generate Encrypted Username and Password
    bcrypt.genSalt(saltRounds, async (err, salt) => {
      // Hash the password
      const encryptedPassword = await bcrypt.hash(Password, salt);
      const encryptedUsername = await bcrypt.hash(Username, salt);

      const params = [
        Username,
        encryptedPassword,
        Cohort,
        Fullname,
        encryptedUsername
      ];

      const pool = new Pool({
        connectionString: cstring
      });

      pool.query(queryString, params, err => {
        pool.end();
        if (err) {
          if (err.detail === "Key (username)=(TestUserName) already exists.") {
            return next({ message: "Username Already Exists" });
          }
          return next(err);
        }
        res.cookie("Auth", encryptedUsername, { httpOnly: true }); //secure: true }); //encryptedUsername, { httpOnly: true, secure: true });
        res.locals = { Username };
        return next();
      });
    });
  },
  signIn: async (req, res, next) => {
    try {
      const { Username, Password } = req.body;

      // Query String
      const queryString =
        "SELECT AuthCookie, Password FROM Users WHERE Username=$1";
      const params = [Username];

      const pool = new Pool({ connectionString: cstring });
      const queryResponse = await pool.query(queryString, params);
      pool.end();

      // console.log(queryResponse);

      const encryptedPassword = queryResponse.rows[0].password;
      const authCookie = queryResponse.rows[0].authcookie;

      const passwordMatch = await bcrypt.compare(Password, encryptedPassword);

      if (passwordMatch) {
        res.cookie("Auth", authCookie, { httpOnly: true, secure: true });
        res.locals = { Username };
      } else {
        return next({ message: "Invalid Login" });
      }

      return next();
    } catch (err) {
      if (err) {
        return next(err);
      }
    }
  },
  signOut: (req, res, next) => {
    res.clearCookie("Auth");
    next();
  },
  checkValidLogin: async (req, res, next) => {
    // const authCookie = req.cookie('Auth');
    // console.log('checking');

    // see if there's a valid user in the DB
    const queryString = 'SELECT * FROM Users WHERE authcookie=$1';
    const params = [req.cookies.Auth];

    const pool = new Pool({ connectionString: cstring });
    const queryResponse = await pool.query(queryString, params);
    pool.end();

    // if more than one row -> user is valid
    // console.log(queryResponse.rows[0]);

    if (queryResponse.rows.length === 1) {
      // console.log(queryResponse.rows);
      res.locals.username = queryResponse.rows[0].username;
      return next();
    }
    return next({ message: { err: 'Please log in' } });
  },
};

module.exports = authController;
