import React, { Component } from 'react';
import Flow from './Flow';
import { UNIFORM } from '../../constants/flowTypes';

const uniformVP = (U, V) => {
  return (x, y) => {
    return U * x + V * y;
  };
};

const uniformStream = (U, V) => {
  return (x, y) => {
    return -V * x + U * y;
  };
};

const uniformXVel = (U, V) => {
  return (x, y) => {
    return U;
  };
};

const uniformYVel = (U, V) => {
  return (x, y) => {
    return V;
  };
};

export const makeUniformFlowFcns = (inputs) => {
  const { U, V } = inputs;
  return {
    vp: uniformVP(U, V),
    stream: uniformStream(U, V),
    xVel: uniformXVel(U, V),
    yVel: uniformYVel(U, V)
  };
};

export default class Uniform extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Uniform"
        type={UNIFORM}
        makeFlowFcns={makeUniformFlowFcns}/>
    );
  };
};