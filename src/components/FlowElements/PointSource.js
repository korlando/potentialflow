import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_SOURCE } from '../../constants/flowTypes';
import { getRadius,
         radiusTeX,
         getRadiusSq,
         radiusSqTeX,
         over2Pi,
         over2PiTeX,
         diffTeX,
         fracTeX } from '../../util';

// velocity potential
const vp = (m, x0, y0) => {
  return (x, y) => {
    const radius = getRadius(x - x0, y - y0);
    if(radius === 0) {
      return -Infinity;
    }
    return over2Pi(m) * Math.log(radius);
  };
};

const vpTeX = (m, x0, y0) => {
  return `${over2PiTeX(m)}ln(${radiusTeX(x0, y0)})`;
};

const vpTeXEq = vpTeX('m', 'x_0', 'y_0');

// stream function
const stream = (m, x0, y0) => {
  return (x, y) => {
    return over2Pi(m) * Math.atan2(y - y0, x - x0);
  };
};

const streamTeX = (m, x0, y0) => {
  return `${over2PiTeX(m)}atan2(${diffTeX('y', y0)}, ${diffTeX('x', x0)})`;
};

const streamTeXEq = streamTeX('m', 'x_0', 'y_0');

// x velocity
const xVel = (m, x0, y0) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    return over2Pi(m) * xDiff / radiusSq;
  };
};

const xVelTeX = (m, x0, y0) => {
  return over2PiTeX(m) + fracTeX(diffTeX('x', x0), radiusSqTeX(x0, y0));
};

const xVelTeXEq = xVelTeX('m', 'x_0', 'y_0');

// y velocity
const yVel = (m, x0, y0) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    return over2Pi(m) * yDiff / radiusSq;
  };
};

const yVelTeX = (m, x0, y0) => {
  return over2PiTeX(m) + fracTeX(diffTeX('y', y0), radiusSqTeX(x0, y0));
};

const yVelTeXEq = yVelTeX('m', 'x_0', 'y_0');

export const makePointSourceFlowFcns = (inputs) => {
  const { m, x0, y0 } = inputs;
  return {
    vp: vp(m, x0, y0),
    stream: stream(m, x0, y0),
    xVel: xVel(m, x0, y0),
    yVel: yVel(m, x0, y0)
  };
};

export const pointSourceFlowStrs = (inputs) => {
  const {m, x0, y0 } = inputs;
  return {
    vp: vpTeX(m, x0, y0),
    stream: streamTeX(m, x0, y0),
    xVel: xVelTeX(m, x0, y0),
    yVel: yVelTeX(m, x0, y0)
  }
};

export const pointSourceEqs = {
  vp: vpTeXEq,
  stream: streamTeXEq,
  xVel: xVelTeXEq,
  yVel: yVelTeXEq
};


export default class PointSource extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Point Source/Sink"
        type={POINT_SOURCE}
        makeFlowFcns={makePointSourceFlowFcns}
        makeFlowStrs={pointSourceFlowStrs}
        eqs={pointSourceEqs}/>
    );
  };
};