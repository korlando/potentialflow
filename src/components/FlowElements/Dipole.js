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

    return (-mu / (2 * Math.PI)) * (
      xDiff * Math.cos(alpha) +
      yDiff * Math.sin(alpha)
    ) / denom;
  };
};

const dipoleStream = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - v0;
    const denom = getDenom(xDiff, yDiff);
    if(denom === 0) {
      return Infinity;
    }

    return (mu / (2 * Math.PI)) * (
      xDiff * Math.sin(alpha) +
      yDiff * Math.cos(alpha)
    ) / denom;
  };
};

const dipoleXVel = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const denom = getDenom(xDiff, yDiff);
    if(denom === 0) {
      return Infinity;
    }

    const sinA = Math.sin(alpha);
    const cosA = Math.cos(alpha);
    return (denom * cosA - 2 * xDiff * (
      xDiff * cosA + yDiff * sinA
    )) / Math.pow(denom, 2);
  };
};

const dipoleYVel = (mu, x0, y0, alpha) => {
  return (x, y) => {
    const xDiff = x - x0;
    const yDiff = y - y0;
    const denom = getDenom(xDiff, yDiff);
    if(denom === 0) {
      return Infinity;
    }

    const sinA = Math.sin(alpha);
    const cosA = Math.cos(alpha);
    return (denom * sinA - 2 * yDiff * (
      xDiff * cosA + yDiff * sinA
    )) / Math.pow(denom, 2);
  };
};

export const makeDipoleFlowFcns = (inputs) => {
  const { mu, x0, y0, alpha } = inputs;
  return {
    vp: dipoleVP(mu, x0, y0, alpha),
    stream: dipoleStream(mu, x0, y0, alpha),
    xVel: dipoleXVel(mu, x0, y0, alpha),
    yVel: dipoleYVel(mu, x0, y0, alpha)
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