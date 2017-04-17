import React, { Component } from 'react';
import PresetFlow from './PresetFlow';
import { UNIFORM, POINT_SOURCE } from '../../../constants/flowTypes';

import { makeUniformFlowFcns, uniformFlowStrs } from '../Uniform';
import { makePointSourceFlowFcns, pointSourceFlowStrs } from '../PointSource';

const uniformInputs = {
  U: 1, V: 0
};
const pointSourceInputs = {
  m: 100, x0: 0, y0: 0
};
const flows = [{
  type: UNIFORM,
  name: 'Uniform Stream',
  inputs: uniformInputs,
  flowFcns: makeUniformFlowFcns(uniformInputs),
  flowStrs: uniformFlowStrs(uniformInputs)
}, {
  type: POINT_SOURCE,
  name: 'Point Source',
  inputs: pointSourceInputs,
  flowFcns: makePointSourceFlowFcns(pointSourceInputs),
  flowStrs: pointSourceFlowStrs(pointSourceInputs)
}];

export default class RankineHalfbody extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return <PresetFlow name="Rankine Halfbody" flows={flows}/>;
  };
};