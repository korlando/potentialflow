import React, { Component } from 'react';
import PresetFlow from './PresetFlow';
import { UNIFORM, DIPOLE, POINT_VORTEX } from '../../../constants/flowTypes';

import { makeUniformFlowFcns, uniformFlowStrs } from '../Uniform';
import { makeDipoleFlowFcns, dipoleFlowStrs } from '../Dipole';
import { makePointVortexFlowFcns, pointVortexFlowStrs } from '../PointVortex';

const uniformInputs = {
  U: -1, V: 0
};
const dipoleInputs = {
  mu: 1000, x0: 0, y0: 0, alpha: 0
};
const pointVortexInputs = {
  gamma: -100, x0: 0, y0: 0
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
}, {
  type: POINT_VORTEX,
  name: 'Point Vortex',
  inputs: pointVortexInputs,
  flowFcns: makePointVortexFlowFcns(pointVortexInputs),
  flowStrs: pointVortexFlowStrs(pointVortexInputs)
}];

export default class RotatingCylinder extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return <PresetFlow name="Rotating Cylinder" flows={flows}/>;
  };
};