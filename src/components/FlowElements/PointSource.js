import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_SOURCE } from '../../constants/flowTypes';
import { getRadius,
         getRadiusSq,
         over2Pi } from '../../util';

const vp = (m, x0, y0) => {
  return (x, y) => {
    const radius = getRadius(x - x0, y - y0);
    if(radius === 0) {
      return -Infinity;
    }
    return over2Pi(m) * Math.log(radius);
  };
};

const stream = (m, x0, y0) => {
  return (x, y) => {
    return over2Pi(m) * Math.atan2(y - y0, x - x0);
  };
};

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

export const makePointSourceFlowFcns = (inputs) => {
  const { m, x0, y0 } = inputs;
  return {
    vp: vp(m, x0, y0),
    stream: stream(m, x0, y0),
    xVel: xVel(m, x0, y0),
    yVel: yVel(m, x0, y0)
  };
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
        makeFlowFcns={makePointSourceFlowFcns}/>
    );
  };
};