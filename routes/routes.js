const express = require('express');
const router = express.Router();
const path = require('path');
const pages = require('./pages');
const { DEFINITIONS } = require('../data/constants');

const definitionsData = Object.assign({}, pages.definitions, {
  definitions: DEFINITIONS.sort((a, b) => {
    const nameA = a.name;
    const nameB = b.name;
    if(nameA > nameB) return 1;
    return -1;
  }),
});

const homeData = Object.assign({}, pages.home, { isApp: true });

module.exports = (production) => {
  router.get('/', (req, res, next) => {
    res.render('home', homeData);
  });

  router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect('/');
    });
  });

  router.get('/definitions', (req, res) => {
    res.render('definitions', definitionsData);
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