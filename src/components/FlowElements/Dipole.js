import React, { Component } from 'react';
import Flow from './Flow';
import { DIPOLE } from '../../constants/flowTypes';

export const dipoleVP = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const denom = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
    if(denom === 0) {
      return Infinity;
    }

    return (-mu / (2 * Math.PI)) * (
      (
        xDiff * Math.cos(alpha) +
        yDiff * Math.sin(alpha)
      ) / denom
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