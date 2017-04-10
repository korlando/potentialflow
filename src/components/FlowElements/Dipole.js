import React, { Component } from 'react';
import Flow from './Flow';
import { DIPOLE } from '../../constants/flowTypes';

export const dipoleVP = (mu, x0, y0, alpha) => {
  return (x, y) => {
    return (-mu / (2 * Math.PI)) * (
      (
        (x - x0) * Math.cos(alpha) +
        (y - y0) * Math.sin(alpha)
      ) /
      (Math.pow(x - x0, 2) + Math.pow(y - y0, 2))
    );
  };
};

const makeVP = (inputs) => {
  const { mu, x0, y0, alpha } = inputs;
  return dipoleVP(mu, x0, y0, alpha);
};

export default class Dipole extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Dipole"
        type={DIPOLE}
        makeVP={makeVP}/>
    );
  };
};