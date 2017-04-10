import React, { Component } from 'react';
import Flow from './Flow';
import { DIPOLE } from '../../constants/flowTypes';

const getDenom = (xDiff, yDiff) => {
  return Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
};

const dipoleVP = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const denom = getDenom(xDiff, yDiff);
    if(denom === 0) {
      // handle divide by 0
      return Infinity;
    }

    return -mu / (2 * Math.PI) * (
      xDiff * Math.cos(alpha) +
      yDiff * Math.sin(alpha)
    ) / denom;
  };
};

export const makeDipoleVP = (inputs) => {
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
        makeVP={makeDipoleVP}/>
    );
  };
};