const bcrypt = require('bcrypt');
const { query } = require('../models/index');

const saltRounds = 10;


const authController = {
  signUp: (req, res, next) => {
    // Destructued the Req Body
    const {
      Username, Password, Cohort, Fullname,
    } = req.body;

    // Query String
    const queryString = `INSERT INTO Users (Username, Password, Cohort, Fullname, AuthCookie)
    Values ($1, $2, $3, $4, $5)
    RETURNING *`;


    // Generate Encrypted Username and Password
    bcrypt.genSalt(saltRounds, async (err, salt) => {
      // Hash the password
      const encryptedPassword = await bcrypt.hash(Password, salt);
      const encryptedUsername = await bcrypt.hash(Username, salt);

      const params = [Username, encryptedPassword, Cohort, Fullname, encryptedUsername];

      query(queryString, params, (err) => {
        if (err) {
          console.log('here', err);
          return next(err);
        }
        res.cookie('Auth', encryptedUsername, { httpOnly: true, secure: true });
        next();
      });
    });
  },
};


module.exports = authController;
