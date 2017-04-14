import React, { Component } from 'react';
import Flow from './Flow';
import { DIPOLE } from '../../constants/flowTypes';
import { getRadiusSq,
         radiusSqTeX,
         over2Pi,
         over2PiTeX,
         diffTeX,
         fracTeX } from '../../util';

const vp = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      // handle divide by 0
      return Infinity;
    }

    return over2Pi(-mu) * (
      xDiff * Math.cos(alpha) +
      yDiff * Math.sin(alpha)
    ) / radiusSq;
  };
};

const stream = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    return over2Pi(mu) * (
      xDiff * Math.sin(alpha) +
      yDiff * Math.cos(alpha)
    ) / radiusSq;
  };
};

const xVel = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    const sinA = Math.sin(alpha);
    const cosA = Math.cos(alpha);
    return (radiusSq * cosA - 2 * xDiff * (
      xDiff * cosA + yDiff * sinA
    )) / Math.pow(radiusSq, 2);
  };
};

const yVel = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    const sinA = Math.sin(alpha);
    const cosA = Math.cos(alpha);
    return (radiusSq * sinA - 2 * yDiff * (
      xDiff * cosA + yDiff * sinA
    )) / Math.pow(radiusSq, 2);
  };
};

export const makeDipoleFlowFcns = (inputs) => {
  const { mu, x0, y0, alpha } = inputs;
  return {
    vp: vp(mu, x0, y0, alpha),
    stream: stream(mu, x0, y0, alpha),
    xVel: xVel(mu, x0, y0, alpha),
    yVel: yVel(mu, x0, y0, alpha)
  };
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
        makeFlowFcns={makeDipoleFlowFcns}/>
    );
  };
};