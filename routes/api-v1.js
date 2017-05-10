const crypto = require('crypto');
const express = require('express');
const router = express.Router();

module.exports = () => {
  router.post('/login', (req, res) => {
    const { p } = req.body;
    if(!p) {
      return res.status(400).json({message: 'p is required'});
    }

    const passArray = process.env.PF_MASTER_PASS.split('/');
    const hash = passArray[0];
    const salt = passArray[1];
    const tryHash = crypto
                    .createHash('sha512')
                    .update(p + salt)
                    .digest('hex');
    if(tryHash !== hash) {
      return res.status(400).json({message: 'Password is incorrect'});
    }
    req.session.loggedIn = true;
    res.status(200).end();
  });

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      res.status(200).end();
    });
  });

  return router;
};