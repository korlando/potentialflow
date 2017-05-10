import React from 'react';
import Flow from './Flow';
import { POINT_SOURCE } from '../../constants/flowTypes';
import { makePointSourceFlowFcns,
         pointSourceFlowStrs,
         pointSourceEqs } from '../../util';

export default (props) => {
  return (
    <Flow
      {...props}
      name="Point Source/Sink"
      type={POINT_SOURCE}
      makeFlowFcns={makePointSourceFlowFcns}
      makeFlowStrs={pointSourceFlowStrs}
      eqs={pointSourceEqs}/>
  );
};