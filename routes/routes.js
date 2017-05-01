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

router.get('/:page', (req, res, next) => {
  const pageName = req.params.page;
  const pageInfo = pages[pageName];
  if(pageInfo) {
    return res.render(`${pageName}.pug`, pageInfo);
  }
  res.status(404).render('404', pages['404']);
});

module.exports = router;