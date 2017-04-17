import React, { Component } from 'react';
import PresetFlow from './PresetFlow';
import { UNIFORM, DIPOLE } from '../../../constants/flowTypes';

import { makeUniformFlowFcns, uniformFlowStrs } from '../Uniform';
import { makeDipoleFlowFcns, dipoleFlowStrs } from '../Dipole';

const uniformInputs = {
  U: -1, V: 0
};
const dipoleInputs = {
  mu: 1000, x0: 0, y0: 0, alpha: 0
};
const flows = [{
  type: UNIFORM,
  name: 'Uniform',
  inputs: uniformInputs,
  flowFcns: makeUniformFlowFcns(uniformInputs),
  flowStrs: uniformFlowStrs(uniformInputs)
}, {
  type: DIPOLE,
  name: 'Dipole',
  inputs: dipoleInputs,
  flowFcns: makeDipoleFlowFcns(dipoleInputs),
  flowStrs: dipoleFlowStrs(dipoleInputs)
}];

export default class Cylinder extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return <PresetFlow name="Cylinder" flows={flows}/>;
  };
};