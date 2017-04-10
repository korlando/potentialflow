import React, { Component } from 'react';
import Flow from './Flow';
import { UNIFORM } from '../../constants/flowTypes';

export const uniformVP = (U, V) => {
  return (x, y) => {
    return U * x + V * y;
  };
};

const makeVP = (inputs) => {
  const { U, V } = inputs;
  return uniformVP(U, V);
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
        makeVP={makeVP}/>
    );
  };
};