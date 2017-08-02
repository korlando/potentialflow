import React from 'react';
import Flow from './Flow';
import { UNIFORM } from '../../constants/flowTypes';
import {
  makeUniformFlowFcns,
  uniformFlowStrs,
  uniformEqs,
} from '../../util';

export default (props) => (
  <Flow
    {...props}
    name="Uniform"
    type={UNIFORM}
    makeFlowFcns={makeUniformFlowFcns}
    makeFlowStrs={uniformFlowStrs}
    eqs={uniformEqs}/>
);