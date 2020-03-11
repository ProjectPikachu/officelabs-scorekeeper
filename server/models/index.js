const { Pool } = require('pg');
// create a new pool here using the connection string above


let cstring = 'postgresql://gkdkscwo:OEIF6xvG7T5duXS_7GlrCdGOLZt6lDsK@rajje.db.elephantsql.com:5432/gkdkscwo';

// If testing environemnt, change cString to testing uri
if (process.env.NODE_ENV === 'test') {
  cstring = 'postgres://kkmfuxxw:8aojLeJ5SAfRdWqq4L-_m0247lneI0ex@drona.db.elephantsql.com:5432/kkmfuxxw';
}

// dev env
const pool = new Pool({
  connectionString: cstring,
});


module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
