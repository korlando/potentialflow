import React, { Component } from 'react';
import Flow from './Flow';
import { DIPOLE } from '../../constants/flowTypes';
import { getRadiusSq,
         radiusSqTeX,
         over2Pi,
         over2PiTeX,
         diffTeX,
         fracTeX } from '../../util';

// velocity potential
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

const vpTeX = (mu, x0, y0, alpha) => {
  const muStr = (typeof mu === 'string') ? `-${mu}` : -mu;
  return over2PiTeX(muStr) + fracTeX(`${diffTeX('x', x0)}cos(${alpha}) + ${diffTeX('y', y0)}sin(${alpha})`, radiusSqTeX(x0, y0));
};

const vpTeXEq = vpTeX('\\mu', 'x_0', 'y_0', '\\alpha');

// stream function
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

const streamTeX = (mu, x0, y0, alpha) => {
  return over2PiTeX(mu) + fracTeX(`${diffTeX('x', x0)}sin(${alpha}) + ${diffTeX('y', y0)}cos(${alpha})`, radiusSqTeX(x0, y0));
};

const streamTeXEq = streamTeX('\\mu', 'x_0', 'y_0', '\\alpha');

// x velocity
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

const xVelTeX = (mu, x0, y0, alpha) => {
  const xDiff = diffTeX('x', x0);
  const yDiff = diffTeX('y', y0);
  const radiusSq = radiusSqTeX(x0, y0);
  const sinA = `sin(${alpha})`;
  const cosA = `cos(${alpha})`;
  return fracTeX(`(${radiusSq})${cosA} - 2(${xDiff})((${xDiff})${cosA} + (${yDiff})${sinA})`, `(${radiusSq})^2`);
};

const xVelTeXEq = xVelTeX('\\mu', 'x_0', 'y_0', '\\alpha');

// y velocity
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

const yVelTeX = (mu, x0, y0, alpha) => {
  const xDiff = diffTeX('x', x0);
  const yDiff = diffTeX('y', y0);
  const radiusSq = radiusSqTeX(x0, y0);
  const sinA = `sin(${alpha})`;
  const cosA = `cos(${alpha})`;
  return fracTeX(`(${radiusSq})${sinA} - 2(${yDiff})((${xDiff})${cosA} + (${yDiff})${sinA})`, `(${radiusSq})^2`);
};

const yVelTeXEq = yVelTeX('\\mu', 'x_0', 'y_0', '\\alpha');

export const makeDipoleFlowFcns = (inputs) => {
  const { mu, x0, y0, alpha } = inputs;
  return {
    vp: vp(mu, x0, y0, alpha),
    stream: stream(mu, x0, y0, alpha),
    xVel: xVel(mu, x0, y0, alpha),
    yVel: yVel(mu, x0, y0, alpha)
  };
};

export const dipoleFlowStrs = (inputs) => {
  const { mu, x0, y0, alpha } = inputs;
  return {
    vp: vpTeX(mu, x0, y0, alpha),
    stream: streamTeX(mu, x0, y0, alpha),
    xVel: xVelTeX(mu, x0, y0, alpha),
    yVel: yVelTeX(mu, x0, y0, alpha)
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
        makeFlowFcns={makeDipoleFlowFcns}
        makeFlowStrs={dipoleFlowStrs}/>
    );
  };
};