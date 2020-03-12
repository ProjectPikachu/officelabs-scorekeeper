const express = require('express');
const gameController = require('../controllers/gameController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/addGame/',
  authController.checkValidLogin,
  gameController.addGame,
  (req, res) => res.status(200).json({}));

router.patch('/addGame/',
  authController.checkValidLogin,
  gameController.patchGame,
  (req, res) => res.sendStatus(200));

router.get('/allUsers/',
  authController.checkValidLogin,
  gameController.allUsers,
  (req, res) => res.status(200).json({ users: res.locals.allUsers }));

router.get('/pending/',
  authController.checkValidLogin,
  gameController.getPending,
  (req, res) => res.status(200).json({
    needsApproval: res.locals.needsApproval,
    waitingOnApproval: res.locals.waitingOnApproval,
  }));

router.get('/leaderboard/',
  gameController.leaderboard,
  (req, res) => res.status(200).json({ leaderboard: res.locals.leaderboard }));

module.exports = router;
