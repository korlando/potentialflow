import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlipMove from 'react-flip-move';

import CloseButton from './CloseButton';
import Uniform from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';
import Corner from './FlowElements/Corner';

import {
  removeFlow,
  removeAllFlows,
} from '../util';
import { addAlert } from '../alert';
import {
  UNIFORM,
  POINT_SOURCE,
  POINT_VORTEX,
  DIPOLE,
  CORNER,
} from '../constants/flowTypes';

const getFlowComponent = (flow, id) => {
  switch(flow.type) {
    case UNIFORM:
      return <div key={id}><Uniform {...flow}/></div>;
    case POINT_SOURCE:
      return <div key={id}><PointSource {...flow}/></div>;
    case POINT_VORTEX:
      return <div key={id}><PointVortex {...flow}/></div>;
    case DIPOLE:
      return <div key={id}><Dipole {...flow}/></div>;
    case CORNER:
      return <div key={id}><Corner {...flow}/></div>;
    default:
      return null;
  }
};

const mapStateToProps = (state) => ({
  activeFlowIds: state.flow.activeFlowIds,
  activeFlowMap: state.flow.activeFlowMap,
});

class ActiveFlowsPanel extends Component {
  render() {
    const { activeFlowIds, activeFlowMap } = this.props;
    const hasFlows = activeFlowIds.length > 0;

    return (
      <div className="flex0 active-flows">
        <div className="flexbox align-items-center"
          style={{marginBottom: '10px'}}>
          <h4 className="flex1" style={{margin: 0, fontSize: '20px'}}>
            Flow Elements &middot; {activeFlowIds.length}
          </h4>
          { hasFlows &&
            <div className="flex0 text-light hover-dark"
              onClick={() => {
                removeAllFlows();
                addAlert('Removed all flows', true, 10 * 1000);
              }}>
              Remove All
            </div>
          }
        </div>
        { !hasFlows &&
          <div className="text-light">
            <p>None yet!</p>
            <p style={{fontSize: '14px'}}>You can add preset or custom flow elements to visualize their behavior.</p>
          </div>
        }
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
                      onClick={() => {
                        removeFlow(flow.flowId);
                        addAlert(`Removed "${flow.name}"`, true, 10 * 1000);
                      }}/>
                  </div>
                  { flow.flowIds.map((flowId, j) => (
                    getFlowComponent(activeFlowMap[flowId], flowId)
                  ))}
                </div>
              );
            }
            return getFlowComponent(flow, id);
          })}
        </FlipMove>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ActiveFlowsPanel);
