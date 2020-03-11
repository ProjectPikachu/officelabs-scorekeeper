const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup/',
  authController.signUp,
  (req, res) => res.status(200).json({ Username: res.locals.Username }));
router.post('/signout/',
  authController.signOut,
  (req, res) => res.sendStatus(200));
router.post('/signin/',
  authController.signIn,
  (req, res) => res.status(200).json({ Username: res.locals.Username }));

module.exports = router;
