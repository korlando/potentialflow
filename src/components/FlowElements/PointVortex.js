import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_VORTEX } from '../../constants/flowTypes';
import { getRadius,
         radiusTeX,
         getRadiusSq,
         radiusSqTeX,
         over2Pi,
         over2PiTeX,
         diffTeX,
         fracTeX } from '../../util';

const vp = (gamma, x0, y0) => {
  return (x, y) => {
    return over2Pi(gamma) * Math.atan2(y - y0, x - x0);
  };
};

const stream = (gamma, x0, y0) => {
  return (x, y) => {
    return over2Pi(gamma) * Math.log(getRadius(x - x0, y - y0));
  };
};

const xVel = (gamma, x0, y0) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    return over2Pi(gamma) * -yDiff / radiusSq;
  };
};

const yVel = (gamma, x0, y0) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const radiusSq = getRadiusSq(xDiff, yDiff);
    if(radiusSq === 0) {
      return Infinity;
    }

    return over2Pi(gamma) * xDiff / radiusSq;
  };
};

export const makePointVortexFlowFcns = (inputs) => {
  const { gamma, x0, y0 } = inputs;
  return {
    vp: vp(gamma, x0, y0),
    stream: stream(gamma, x0, y0),
    xVel: xVel(gamma, x0, y0),
    yVel: yVel(gamma, x0, y0)
  };
};

export default class PointVortex extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Point Vortex"
        type={POINT_VORTEX}
        makeFlowFcns={makePointVortexFlowFcns}/>
    );
  };
};