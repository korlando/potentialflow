import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_VORTEX } from '../../constants/flowTypes';

export const pointVortexVP = (gamma, x0, y0) => {
  return (x, y) => {
    return (gamma / (2 * Math.PI)) * Math.atan2(
      (y - y0),
      (x - x0)
    );
  };
};

const makeVP = (inputs) => {
  const { gamma, x0, y0 } = inputs;
  return pointVortexVP(gamma, x0, y0);
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
        makeVP={makeVP}/>
    );
  };
};