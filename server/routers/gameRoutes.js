const express = require('express');
const gameController = require('../controllers/gameController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/addGame/',
  authController.checkValidLogin,
  gameController.addGame,
  (req, res) => res.status(200).json({}));

router.post('/getGamers/',
  gameController.getGamers,
  (req, res) => res.sendStatus(200));

router.get('/pending/',
  authController.checkValidLogin,
  gameController.getPending,
  (req, res) => res.status(200).json({
    needsApproval: res.locals.needsApproval,
    waitingOnApproval: res.locals.waitingOnApproval,
  }));

router.post('/leaderboard/',
  gameController.leaderboard,
  (req, res) => res.status(200).json({}));

module.exports = router;
