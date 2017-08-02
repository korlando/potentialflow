import React from 'react';
import Naught from '../components/Naught';

export default {
  U: {
    name: 'U',
    placeholder: 'X strength'
  },
  V: {
    name: 'V',
    placeholder: 'Y strength'
  },
  x0: {
    name: <Naught symbol="x"/>,
    placeholder: 'X position'
  },
  y0: {
    name: <Naught symbol="y"/>,
    placeholder: 'Y position'
  },
  theta0: {
    name: <Naught symbol={<span>&theta;</span>}/>,
    placeholder: 'Orientation',
  },
  m: {
    name: 'm',
    placeholder: 'Magnitude'
  },
  mu: {
    name: <span>&mu;</span>,
    placeholder: 'Magnitude'
  },
  gamma: {
    name: <span>&Gamma;</span>,
    placeholder: 'Magnitude'
  },
  alpha: {
    name: <span>&alpha;</span>,
    placeholder: 'Angle'
  },
  beta: {
    name: <span>&beta;</span>,
    placeholder: 'Magnitude',
  },
};