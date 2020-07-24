import React from 'react';
import Flow from './Flow';
import { POINT_VORTEX } from '../../constants/flowTypes';
import {
  makePointVortexFlowFcns,
  pointVortexFlowStrs,
  pointVortexEqs,
} from '../../util';

export default props => (
  <Flow
    {...props}
    name="Point Vortex"
    type={POINT_VORTEX}
    makeFlowFcns={makePointVortexFlowFcns}
    makeFlowStrs={pointVortexFlowStrs}
    eqs={pointVortexEqs}
  />
);
