import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_VORTEX } from '../../constants/flowTypes';

const pointVortexVP = (gamma, x0, y0) => {
  return (x, y) => {
    return (gamma / (2 * Math.PI)) * Math.atan2(
      (y - y0),
      (x - x0)
    );
  };
};

const pointVortexStream = (gamma, x0, y0) => {
  return (x, y) => {
    return (gamma / (2 * Math.PI)) * Math.log(Math.sqrt(
      Math.pow(x - x0, 2) + Math.pow(y - y0, 2)
    ));
  };
};

const pointVortexXVel = (gamma, x0, y0) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const val = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if(val === 0) {
      return Infinity;
    }

    return (gamma / (2 * Math.PI * val)) * (-yDiff / val);
  };
};

const pointVortexYVel = (gamma, x0, y0) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const val = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if(val === 0) {
      return Infinity
    }

    return (gamma / (2 * Math.PI * val)) * (xDiff / val);
  };
};

export const makePointVortexFlowFcns = (inputs) => {
  const { gamma, x0, y0 } = inputs;
  return {
    vp: pointVortexVP(gamma, x0, y0),
    stream: pointVortexStream(gamma, x0, y0),
    xVel: pointVortexXVel(gamma, x0, y0),
    yVel: pointVortexYVel(gamma, x0, y0)
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