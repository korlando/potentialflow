const { DOMAIN, SITE_NAME } = require('../data/constants');

// map page pathname to metadata
module.exports = {
  'home': {
    title: 'Potential Flow Graphing App',
    description: 'Plot the velocity potential, stream function, and velocity field of 2D potential flow fields constructed using discrete flow elements. Build classical examples of 2D potential flow fields like the Rankine halfbody, Rankine oval, and cylinder in a free stream or build completely custom flow fields.',
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
    description: '',
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