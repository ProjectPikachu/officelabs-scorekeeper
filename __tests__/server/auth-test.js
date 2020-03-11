/* eslint-disable no-undef */
const request = require('supertest');
const { Pool } = require('pg');
const app = require('../.././server/app.js');

// RESOURCES:
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

// create tables in database:
const createDB = `CREATE TABLE Users
    (
      UserId SERIAL PRIMARY KEY,
      Username VARCHAR(100) UNIQUE,
      Password VARCHAR(100),
      Cohort int,
      FullName VARCHAR(100),
      AuthCookie VARCHAR(100) UNIQUE
    ); 
  CREATE TABLE Games
    (   GameId SERIAL PRIMARY KEY,
        WinnerID int,
        LoserID int,
        WinnerPoints int,
        LoserPoints int,
        WinnerConfirm BOOL,
        LoserConfirm BOOL,
        Foreign Key (WinnerID) REFERENCES Users(UserID),
        Foreign Key (LoserID) REFERENCES Users(UserID)
    );
  `;

// clear all tables in DB
const dropDB = `DROP TABLE IF EXISTS Games; 
DROP TABLE IF EXISTS Users;`;

describe('AUTH:', () => {
// create a new pool
  const pool = new Pool({
    connectionString: 'postgres://kkmfuxxw:8aojLeJ5SAfRdWqq4L-_m0247lneI0ex@drona.db.elephantsql.com:5432/kkmfuxxw',
  });

  // Before each test, add the tables to database
  beforeEach(async (done) => {
    await pool.query(dropDB);
    await pool.query(createDB);
    done();
  });

  // After Each test, clear all the tables in Database
  afterEach(() => pool.query(dropDB));

  // Close the pool after all the tests
  afterAll((done) => {
    pool.end();
    done();
  });


  // function for posting to db
  const addUser = () => request(app)
    .post('/auth/signup')
    .send({
      Username: 'TestUserName',
      Password: 'testPassword',
      Cohort: 16,
      Fullname: 'testFullName',
    });

  // function for posting to db
  const loginUser = () => request(app)
    .post('/auth/signin')
    .send({
      Username: 'TestUserName',
      Password: 'testPassword',
    });

  const signOutRequest = (authCookie) => request(app)
    .post('/auth/signout')
    .set('Cookie', [`Auth=${authCookie}`])
    .send();


  // Function for querying items in User table for Test DB
  const getUserTestDB = () => pool.query('Select * from Users where Username = \'TestUserName\'');

  // Test a user has signed up
  // Check that the non enrypted password isn't stored in the database
  it('A user can sign up with an encrypted password', async (done) => {
    await addUser()
      .expect(200)
      .then((res) => {
        expect(res.headers['set-cookie']).not.toEqual(undefined);
        expect(res.body).toEqual({ Username: 'TestUserName' });
      });
    const User = await getUserTestDB();
    expect(User.rows[0].username).toEqual('TestUserName');
    expect(User.rows[0].cohort).toEqual(16);
    expect(User.rows[0].fullname).toEqual('testFullName');
    expect(User.rows[0].password).not.toEqual('testPassword');
    return done();
  });

  // Return a fail message if that user has already signed up
  it('A user cant sign up twice', async (done) => {
    await addUser();
    await addUser()
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual('Username Already Exists');
      });
    return done();
  });

  it('User can successfully signout and log back in', async (done) => {
    let authCookie;
    let stringCookie;

    await addUser()
      .then((res) => {
        [stringCookie] = res.headers['set-cookie'];
        // console.log(stringCookie);
        const cookieArray = stringCookie.split('; ');
        for (let i = 0; i < cookieArray.length; i += 1) {
          if (cookieArray[i].includes('Auth=')) {
            authCookie = cookieArray[i].replace('Auth=', '');
            break;
          }
        }
      });

    await signOutRequest(authCookie)
      .expect(200)
      .expect('set-cookie', 'Auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    await loginUser()
      .expect(200)
      .then((res) => {
        expect(res.headers['set-cookie']).toEqual([stringCookie]);
        expect(res.body).toEqual({ Username: 'TestUserName' });
      });

    return done();
  });

  it('User can cannot login with the wrong password', async (done) => {
    let authCookie;
    let stringCookie;

    await addUser()
      .then((res) => {
        [stringCookie] = res.headers['set-cookie'];
        // console.log(stringCookie);
        const cookieArray = stringCookie.split('; ');
        for (let i = 0; i < cookieArray.length; i += 1) {
          if (cookieArray[i].includes('Auth=')) {
            authCookie = cookieArray[i].replace('Auth=', '');
            break;
          }
        }
      });

    await signOutRequest(authCookie)
      .expect(200)
      .expect('set-cookie', 'Auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    await request(app)
      .post('/auth/signin')
      .send({
        Username: 'TestUserName',
        Password: 'wrongPassword',
      })
      .expect(400)
      .then((res) => {
        // expect(res.headers['set-cookie']).toEqual([stringCookie]);
      });

    return done();
  });
});


// describe('GAMES:', () => {


//   it('Auth',(done) => {
//     request(app)
//       .get('/api')
//       .then(res => {
//         expect(res.statusCode).toBe(200);
//         done()
//       })
//   });

//   it('should test that true === true',(done) => {
//     request(app)
//       .get('/api')
//       .then(res => {
//         expect(res.statusCode).toBe(200);
//         done()
//       })
//   });


// })
