import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeFlow } from '../util';
import FlipMove from 'react-flip-move';

import CloseButton from './CloseButton';
import Uniform from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';

import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';

const getFlowComponent = (flow, id) => {
  switch(flow.type) {
    case UNIFORM:
      return <Uniform key={id} {...flow}/>;
    case POINT_SOURCE:
      return <PointSource key={id} {...flow}/>;
    case POINT_VORTEX:
      return <PointVortex key={id} {...flow}/>;
    case DIPOLE:
      return <Dipole key={id} {...flow}/>;
    default:
      return null;
  }
};

const mapStateToProps = (state) => {
  return {
    activeFlowIds: state.flow.activeFlowIds,
    activeFlowMap: state.flow.activeFlowMap
  };
};

@connect(mapStateToProps)
export default class ActiveFlowsPanel extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { activeFlowIds, activeFlowMap } = this.props;

    return (
      <div className="flex0 active-flows">
        <h4>Current Flows &middot; {activeFlowIds.length}</h4>
        <FlipMove
          enterAnimation="fade"
          leaveAnimation="fade"
          staggerDurationBy={10}>
          { activeFlowIds.map((id, i) => {
            const flow = activeFlowMap[id];
            if(flow.group) {
              return (
                <div key={id} className="flow-group">
                  <div className="flexbox align-items-center title">
                    <label className="flex1">
                      {flow.name}
                    </label>
                    <CloseButton
                      className="flex0"
                      onClick={() => removeFlow(flow.flowId)}/>
                  </div>
                  { flow.flowIds.map((flowId, j) => {
                    return getFlowComponent(activeFlowMap[flowId], flowId);
                  })}
                </div>
              );
            } else {
              return getFlowComponent(flow, id);
            }
          })}
        </FlipMove>
      </div>
    );
  };
};