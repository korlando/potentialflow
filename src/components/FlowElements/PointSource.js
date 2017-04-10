import React, { Component } from 'react';
import Flow from './Flow';
import { POINT_SOURCE } from '../../constants/flowTypes';

export const pointSourceVP = (m, x0, y0) => {
  return (x, y) => {
    return (m / (2 * Math.PI)) * Math.log(
      Math.sqrt(Math.pow((x - x0), 2)) +
      Math.sqrt(Math.pow((y - y0), 2))
    );
  };
};

const makeVP = (inputs) => {
  const { m, x0, y0 } = inputs;
  return pointSourceVP(m, x0, y0);
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
        makeVP={makeVP}/>
    );
  };
};