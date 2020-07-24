import React from 'react';
import Flow from './Flow';
import { DIPOLE } from '../../constants/flowTypes';
import {
  makeDipoleFlowFcns,
  dipoleFlowStrs,
  dipoleEqs,
} from '../../util';

export default props => (
  <Flow
    {...props}
    name="Dipole"
    type={DIPOLE}
    makeFlowFcns={makeDipoleFlowFcns}
    makeFlowStrs={dipoleFlowStrs}
    eqs={dipoleEqs}
  />
);
