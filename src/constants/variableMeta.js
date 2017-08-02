import React from 'react';
import Naught from '../components/Naught';

export default {
  U: {
    name: 'U',
    placeholder: 'x strength'
  },
  V: {
    name: 'V',
    placeholder: 'y strength'
  },
  x0: {
    name: <Naught symbol="x"/>,
    placeholder: 'x position'
  },
  y0: {
    name: <Naught symbol="y"/>,
    placeholder: 'y position'
  },
  theta0: {
    name: <Naught symbol={<span>&theta;</span>}/>,
    placeholder: 'offset angle',
  },
  m: {
    name: 'm',
    placeholder: 'magnitude'
  },
  mu: {
    name: <span>&mu;</span>,
    placeholder: 'magnitude'
  },
  gamma: {
    name: <span>&Gamma;</span>,
    placeholder: 'magnitude'
  },
  alpha: {
    name: <span>&alpha;</span>,
    placeholder: 'angle'
  },
  beta: {
    name: <span>&beta;</span>,
    placeholder: 'magnitude',
  },
};