import React, { Component } from 'react';
import PresetFlow from './PresetFlow';
import { UNIFORM, DIPOLE } from '../../../constants/flowTypes';
import {
  makeUniformFlowFcns,
  uniformFlowStrs,
  makeDipoleFlowFcns,
  dipoleFlowStrs,
} from '../../../util';

const uniformInputs = {
  U: -1, V: 0
};
const dipoleInputs = {
  mu: 250, x0: 0, y0: 0, alpha: 0,
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
}];

export default class Cylinder extends Component {
  render() {
    return <PresetFlow name="Cylinder" flows={flows} />;
  }
}
