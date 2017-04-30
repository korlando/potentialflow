const express = require('express');
const router = express.Router();
const path = require('path');
const pages = require('./pages');

router.get('/', (req, res, next) => {
  res.render('home', pages.home);
  /*res.sendFile(path.resolve(__dirname, '../www/index.html'), {}, (err) => {
    if(err) {
      next(err);
    }
  });*/
});

module.exports = router;