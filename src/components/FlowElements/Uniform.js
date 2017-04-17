import React, { Component } from 'react';
import Flow from './Flow';
import { UNIFORM } from '../../constants/flowTypes';

// velocity potential
const vp = (U, V) => {
  return (x, y) => {
    return U * x + V * y;
  };
};

const vpTeX = (U, V) => {
  const VStr = V < 0 ? `- ${-V}` : `+ ${V}`;
  return `${U}x ${VStr}y`;
};

const vpTeXEq = vpTeX('U', 'V');

// stream function
const stream = (U, V) => {
  return (x, y) => {
    return -V * x + U * y;
  };
};

const streamTeX = (U, V) => {
  const VStr = V < 0 ? -V : `-${V}`;
  const UStr = U < 0 ? ` - ${-U}` : `+ ${U}`;
  return `${VStr}x ${UStr}y`;
};

const streamTeXEq = streamTeX('U', 'V');

// x velocity
const xVel = (U, V) => {
  return (x, y) => {
    return U;
  };
};

const xVelTeX = (U, V) => {
  return U;
};

const xVelTeXEq = xVelTeX('U', 'V');

// y velocity
const yVel = (U, V) => {
  return (x, y) => {
    return V;
  };
};

const yVelTeX = (U, V) => {
  return V;
};

const yVelTeXEq = yVelTeX('U', 'V');

export const makeUniformFlowFcns = (inputs) => {
  const { U, V } = inputs;
  return {
    vp: vp(U, V),
    stream: stream(U, V),
    xVel: xVel(U, V),
    yVel: yVel(U, V)
  };
};

export const uniformFlowStrs = (inputs) => {
  const { U, V } = inputs;
  return {
    vp: vpTeX(U, V),
    stream: streamTeX(U, V),
    xVel: xVelTeX(U, V),
    yVel: yVelTeX(U, V)
  };
};

export const uniformEqs = {
  vp: vpTeXEq,
  stream: streamTeXEq,
  xVel: xVelTeXEq,
  yVel: yVelTeXEq
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
        makeFlowFcns={makeUniformFlowFcns}
        makeFlowStrs={uniformFlowStrs}
        eqs={uniformEqs}/>
    );
  };
};