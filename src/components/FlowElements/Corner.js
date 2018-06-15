import React from 'react';
import Flow from './Flow';
import { CORNER } from '../../constants/flowTypes';
import {
  makeCornerFlowFcns,
  cornerFlowStrs,
  cornerEqs,
} from '../../util';

export default (props) => (
  <Flow
    {...props}
    name="Corner"
    type={CORNER}
    makeFlowFcns={makeCornerFlowFcns}
    makeFlowStrs={cornerFlowStrs}
    eqs={cornerEqs}
  />
);