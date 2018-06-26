import React, { Component } from 'react';
import PresetFlow from './PresetFlow';
import { UNIFORM, DIPOLE, POINT_VORTEX } from '../../../constants/flowTypes';
import {
  makeUniformFlowFcns,
  uniformFlowStrs,
  makeDipoleFlowFcns,
  dipoleFlowStrs,
  makePointVortexFlowFcns,
  pointVortexFlowStrs,
} from '../../../util';

const uniformInputs = {
  U: -8, V: 0,
};
const dipoleInputs = {
  mu: 500, x0: 0, y0: 0, alpha: 0,
};
const pointVortexInputs = {
  gamma: -75, x0: 0, y0: 0,
};
const flows = [{
  type: UNIFORM,
  name: 'Uniform Stream',
  inputs: uniformInputs,
  flowFcns: makeUniformFlowFcns(uniformInputs),
  flowStrs: uniformFlowStrs(uniformInputs),
}, {
  type: DIPOLE,
  name: 'Dipole',
  inputs: dipoleInputs,
  flowFcns: makeDipoleFlowFcns(dipoleInputs),
  flowStrs: dipoleFlowStrs(dipoleInputs),
}, {
  type: POINT_VORTEX,
  name: 'Point Vortex',
  inputs: pointVortexInputs,
  flowFcns: makePointVortexFlowFcns(pointVortexInputs),
  flowStrs: pointVortexFlowStrs(pointVortexInputs),
}];

export default class RotatingCylinder extends Component {
  render() {
    return <PresetFlow name="Rotating Cylinder" flows={flows} />;
  }
}
