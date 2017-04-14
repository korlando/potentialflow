import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_SOURCE } from '../../constants/flowTypes';

const pointSourceVP = (m, x0, y0) => {
  return (x, y) => {
    const val = Math.sqrt(Math.pow((x - x0), 2) + Math.pow((y - y0), 2));
    if(val === 0) {
      return -Infinity;
    }
    return (m / (2 * Math.PI)) * Math.log(val);
  };
};

const pointSourceStream = (m, x0, y0) => {
  return (x, y) => {
    return (m / (2 * Math.PI) * Math.atan2(
      (y - y0), (x - x0)
    ));
  };
};

const pointSourceXVel = (m, x0, y0) => {
  return (x, y) => {
    const val = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
    if(val === 0) {
      return Infinity;
    }

    return (m / (2 * Math.PI * val)) * ((x - x0) / val);
  };
};

const pointSourceYVel = (m, x0, y0) => {
  return (x, y) => {
    const val = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
    if(val === 0) {
      return Infinity;
    }

    return (m / (2 * Math.PI * val)) * ((y - y0) / val);
  };
};

export const makePointSourceFlowFcns = (inputs) => {
  const { m, x0, y0 } = inputs;
  return {
    vp: pointSourceVP(m, x0, y0),
    stream: pointSourceStream(m, x0, y0),
    xVel: pointSourceXVel(m, x0, y0),
    yVel: pointSourceYVel(m, x0, y0)
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