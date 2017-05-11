const constants = require('../data/constants');
const { DOMAIN } = constants;

// map page pathname to metadata
module.exports = {
  'home': {
    title: 'Potential Flow Graphing App',
    description: '',
    url: `${DOMAIN}`
  },
  'about': {
    title: 'About - Potential Flow',
    description: '',
    url: `${DOMAIN}/about`
  },
  'story': {
    title: 'The Story of Potential Flow - Potential Flow',
    description: 'Potential flow is an idealized model of fluid dynamics that applies when a flow is inviscid, incompressible, and irrotational.',
    url: `${DOMAIN}/story`
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