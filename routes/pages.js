const { DOMAIN, SITE_NAME } = require('../data/constants');

// map page pathname to metadata
module.exports = {
  'home': {
    title: 'Potential Flow Graphing App',
    description: '',
    url: `${DOMAIN}`
  },
  'contact': {
    title: 'Contact - Potential Flow',
    description: '',
    url: `${DOMAIN}/contact`
  },
  'story': {
    title: 'The Story of Potential Flow - Potential Flow',
    description: 'Potential flow is an idealized model of fluid dynamics that applies when a flow is inviscid, incompressible, and irrotational.',
    url: `${DOMAIN}/story`
  },
  'flow-elements': {
    title: 'Flow Elements - ' + SITE_NAME,
    url: DOMAIN + '/flow-elements',
  },
  'definitions': {
    title: 'Definitions - Potential Flow',
    description: '',
    url: `${DOMAIN}/definitions`
  },
  'derivations': {
    title: 'Derivations - Potential Flow',
    description: '',
    url: `${DOMAIN}/derivations`
  },
  'faq': {
    title: 'FAQ - Potential Flow',
    description: '',
    url: `${DOMAIN}/faq`
  },
  'equations': {
    title: 'Equation Sheet - Potential Flow',
    description: '',
    url: `${DOMAIN}/equations`
  },
  'references': {
    title: 'References - Potential Flow',
    description: '',
    url: `${DOMAIN}/references`
  },
  '404': {
    title: '404 Not Found - Potential Flow',
    description: '',
    url: `${DOMAIN}/404`
  }
};