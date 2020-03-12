/* eslint-disable no-undef */
const request = require('supertest');
const { Pool } = require('pg');
const app = require('../.././server/app.js');

// RESOURCES:
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

// create tables in database:
const createDB = `
  CREATE TABLE Users
  (
    UserId SERIAL PRIMARY KEY,
    Username VARCHAR(100) UNIQUE,
    Password VARCHAR(100),
    Cohort int,
    FullName VARCHAR(100),
    AuthCookie VARCHAR(100) UNIQUE
  ); 
  CREATE TABLE Games
  (   
    GameId SERIAL PRIMARY KEY,
    WinnerName VARCHAR(100) NOT NULL,
    LoserName VARCHAR(100) NOT NULL,
    WinnerPoints int NOT NULL,
    LoserPoints int NOT NULL,
    WinnerConfirm BOOL NOT NULL,
    LoserConfirm BOOL NOT NULL,
    posting_date DATE NOT NULL,
    Foreign Key (WinnerName) REFERENCES Users(Username),
    Foreign Key (LoserName) REFERENCES Users(Username)
  );`;

// function for posting to db
const addUser = (userInfo) => request(app)
  .post('/auth/signup')
  .send(userInfo);

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

// clear all tables in DB
const dropDB = `DROP TABLE IF EXISTS Games; 
DROP TABLE IF EXISTS Users;`;

describe('AUTH:', () => {
  const user1 = {
    Username: 'TestUserName',
    Password: 'testPassword',
    Cohort: 16,
    Fullname: 'testFullName',
  };

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

  // Function for querying items in User table for Test DB
  const getUserTestDB = () => pool.query('Select * from Users where Username = \'TestUserName\'');

  // Test a user has signed up
  // Check that the non enrypted password isn't stored in the database
  it('A user can sign up with an encrypted password', async (done) => {
    await addUser(user1)
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
    await addUser(user1);
    await addUser(user1)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual('Username Already Exists');
      });
    return done();
  });

  it('User can successfully signout and log back in', async (done) => {
    let authCookie;
    let stringCookie;

    await addUser(user1)
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

    await addUser(user1)
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


describe('GAMES:', () => {
  const user1 = {
    Username: 'Red',
    Password: 'test1',
    Cohort: 16,
    Fullname: 'red',
  };

  const user2 = {
    Username: 'Blue',
    Password: 'test2',
    Cohort: 16,
    Fullname: 'Blue',
  };

  const game1 = {
    yourUsername: 'Blue',
    opponentUsername: 'Red',
    yourPoints: 10,
    opponentPoints: 21,
    gameDate: '2020-03-11',
  };

  const wrongGame = {
    yourUsername: 'Blue',
    opponentUsername: 'Green',
    yourPoints: 'a',
    opponentPoints: 21,
    gameDate: '2020-03-11',
  };

  const addGame = (gameInfo, authCookie) => request(app)
    .post('/game/addgame')
    .set('Cookie', [`Auth=${authCookie}`])
    .send(gameInfo);

  const getPendingGames = (authCookie) => request(app)
    .get('/game/pending')
    .set('Cookie', [`Auth=${authCookie}`])
    .send();

  const getAllUsers = (authCookie) => request(app)
    .get('/game/allUsers')
    .set('Cookie', [`Auth=${authCookie}`])
    .send();

  const patchGame = (gameID, authCookie) => request(app)
    .patch('/game/addgame')
    .set('Cookie', [`Auth=${authCookie}`])
    .send(gameID);

  const getLeaderboard = () => request(app)
    .get('/game/leaderboard')
    .send();

  // create a new pool
  const pool = new Pool({
    connectionString: 'postgres://kkmfuxxw:8aojLeJ5SAfRdWqq4L-_m0247lneI0ex@drona.db.elephantsql.com:5432/kkmfuxxw',
  });

  // Before each test, add the tables to database
  beforeEach(async (done) => {
    // console.log(dropDB);
    // console.log(createDB);
    await pool.query(dropDB);
    await pool.query(createDB);
    // const users = await pool.query('Select * from Users');
    // const games = await pool.query('Select * from Games');
    // // console.log(res);
    // console.log(users);
    // console.log(games);
    return done();
  });

  // After Each test, clear all the tables in Database
  // afterEach(() => pool.query(dropDB));

  // Close the pool after all the tests
  afterAll((done) => {
    pool.end();
    done();
  });

  it('User can add a game for comfirmation', async (done) => {
    let stringCookie;
    let authCookie;

    await addUser(user1);
    await signOutRequest();
    await addUser(user2)
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

    // console.log('game 1: ', game1);
    await addGame(game1, authCookie)
      .expect(200);

    return done();
  });

  it('Only adds a valid game', async (done) => {
    // let stringCookie;
    let authCookie;

    await addUser(user1);
    await signOutRequest();
    const res = await addUser(user2);
    // .then((res) => {
    //   // console.log(res)
    //   [stringCookie] = res.headers['set-cookie'];
    //   // console.log(stringCookie);
    //   const cookieArray = stringCookie.split('; ');
    //   for (let i = 0; i < cookieArray.length; i += 1) {
    //     if (cookieArray[i].includes('Auth=')) {
    //       authCookie = cookieArray[i].replace('Auth=', '');
    //       break;
    //     }
    //   }
    // });
    const [stringCookie] = res.headers['set-cookie'];
    // console.log(stringCookie);
    const cookieArray = stringCookie.split('; ');

    for (let i = 0; i < cookieArray.length; i += 1) {
      if (cookieArray[i].includes('Auth=')) {
        authCookie = cookieArray[i].replace('Auth=', '');
        break;
      }
    }

    // console.log('Auth: ', authCookie);
    const response = await addGame(wrongGame, authCookie);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({ err: 'Unable to add game' });
    // console.log(response.statusCode);

    return done();
  });

  it('User can get all pending games', async (done) => {
    // let stringCookie;
    let authCookie1;
    let authCookie2;

    const user1Response = await addUser(user1);
    const [stringCookie1] = user1Response.headers['set-cookie'];
    const cookieArray1 = stringCookie1.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray1.length; i += 1) {
      if (cookieArray1[i].includes('Auth=')) {
        authCookie1 = cookieArray1[i].replace('Auth=', '');
        break;
      }
    }

    const user2Response = await addUser(user2);
    const [stringCookie2] = user2Response.headers['set-cookie'];
    const cookieArray2 = stringCookie2.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray2.length; i += 1) {
      if (cookieArray2[i].includes('Auth=')) {
        authCookie2 = cookieArray2[i].replace('Auth=', '');
        break;
      }
    }

    // console.log('Auth: ', authCookie);
    // Game 1: submitted by Blue, needs approval by Red
    await addGame(game1, authCookie2);

    // Red is User 1
    const redPendingGames = await getPendingGames(authCookie1);
    // console.log(redPendingGames.body);

    expect(redPendingGames.status).toEqual(200);

    expect(redPendingGames.body.needsApproval).toEqual([{
      gameid: 1,
      winnername: 'Red',
      losername: 'Blue',
      winnerpoints: 21,
      loserpoints: 10,
      winnerconfirm: false,
      loserconfirm: true,
      posting_date: '2020-03-11T04:00:00.000Z',
    }]);
    expect(redPendingGames.body.waitingOnApproval).toEqual([]);

    // Blue is User 2
    const bluePendingGames = await getPendingGames(authCookie2);
    // console.log(bluePendingGames.body);

    expect(bluePendingGames.status).toEqual(200);
    expect(bluePendingGames.body.waitingOnApproval).toEqual([{
      gameid: 1,
      winnername: 'Red',
      losername: 'Blue',
      winnerpoints: 21,
      loserpoints: 10,
      winnerconfirm: false,
      loserconfirm: true,
      posting_date: '2020-03-11T04:00:00.000Z',
    }]);
    expect(bluePendingGames.body.needsApproval).toEqual([]);


    return done();
  });

  it('User can get all users', async (done) => {
    // Add a user and get their cookie
    let authCookie1;

    const user1Response = await addUser(user1);
    const [stringCookie1] = user1Response.headers['set-cookie'];
    const cookieArray1 = stringCookie1.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray1.length; i += 1) {
      if (cookieArray1[i].includes('Auth=')) {
        authCookie1 = cookieArray1[i].replace('Auth=', '');
        break;
      }
    }

    // Invoke a getUser function - makes a request to get all users
    const allUsers = await getAllUsers(authCookie1);
    expect(allUsers.status).toEqual(200);
    expect(allUsers.body.users).toEqual([{ username: 'Red', fullname: 'red' }]);
    return done();
  });

  it('User can approve a pending game', async (done) => {
    // let stringCookie;
    let authCookie1;
    let authCookie2;

    const user1Response = await addUser(user1);
    const [stringCookie1] = user1Response.headers['set-cookie'];
    const cookieArray1 = stringCookie1.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray1.length; i += 1) {
      if (cookieArray1[i].includes('Auth=')) {
        authCookie1 = cookieArray1[i].replace('Auth=', '');
        break;
      }
    }

    const user2Response = await addUser(user2);
    const [stringCookie2] = user2Response.headers['set-cookie'];
    const cookieArray2 = stringCookie2.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray2.length; i += 1) {
      if (cookieArray2[i].includes('Auth=')) {
        authCookie2 = cookieArray2[i].replace('Auth=', '');
        break;
      }
    }

    await addGame(game1, authCookie2);

    const user1Games = await getPendingGames(authCookie1);
    const gameInfo = { gameid: user1Games.body.needsApproval[0].gameid };

    const patching = await patchGame(gameInfo, authCookie1);
    expect(patching.status).toEqual(200);


    const user1Games2 = await getPendingGames(authCookie1);
    expect(user1Games2.body.needsApproval.length).toEqual(0);


    return done();
  });

  it('User can get leaderboard', async (done) => {
    // let stringCookie;
    let authCookie1;
    let authCookie2;

    const user1Response = await addUser(user1);
    const [stringCookie1] = user1Response.headers['set-cookie'];
    const cookieArray1 = stringCookie1.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray1.length; i += 1) {
      if (cookieArray1[i].includes('Auth=')) {
        authCookie1 = cookieArray1[i].replace('Auth=', '');
        break;
      }
    }

    const user2Response = await addUser(user2);
    const [stringCookie2] = user2Response.headers['set-cookie'];
    const cookieArray2 = stringCookie2.split('; ');

    // get authCookie to send with patch
    for (let i = 0; i < cookieArray2.length; i += 1) {
      if (cookieArray2[i].includes('Auth=')) {
        authCookie2 = cookieArray2[i].replace('Auth=', '');
        break;
      }
    }

    await addGame(game1, authCookie2);

    const user1Games = await getPendingGames(authCookie1);
    const gameInfo = { gameid: user1Games.body.needsApproval[0].gameid };

    const patching = await patchGame(gameInfo, authCookie1);
    expect(patching.status).toEqual(200);


    const user1Games2 = await getPendingGames(authCookie1);
    expect(user1Games2.body.needsApproval.length).toEqual(0);


    // Sends a request to get a leaderboard
    const leaders = await getLeaderboard();
    expect(leaders.status).toEqual(200);
    expect(leaders.body.leaderboard).toEqual({ 1: { username: 'Red', wins: '1' } }); // 2: { username: 'Blue', wins: 0 } });
    return done();
  });
});
