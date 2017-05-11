const express = require('express');
const router = express.Router();
const path = require('path');
const pages = require('./pages');

module.exports = (production) => {
  router.get('*', (req, res, next) => {
    if(!req.session.loggedIn) {
      return res.render('login');
    }
    next();
  });

  router.get('/', (req, res, next) => {
    res.render('home', pages.home);
  });

  router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect('/');
    });
  });

  router.get('/:page', (req, res, next) => {
    const pageName = req.params.page;
    const pageInfo = pages[pageName];
    if(pageInfo) {
      return res.render(`${pageName}.pug`, pageInfo);
    }
    res.status(404).render('404', pages['404']);
  });
  
  return router;
};