import React, { Component } from 'react';
import { connect } from 'react-redux';
import CloseButton from './CloseButton';
import Uniform, { makeUniformVP } from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';
import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';
import { addFlow } from '../util';

const typeMap = {
  [UNIFORM]: Uniform,
  [POINT_SOURCE]: PointSource,
  [POINT_VORTEX]: PointVortex,
  [DIPOLE]: Dipole
};

function makeVelocityPotential(flowIds, flowMap) {
  let velocityPotential = (x, y) => 0;
  flowIds.forEach((id) => {
    const currentVP = velocityPotential;
    velocityPotential = (x, y) => {
      return currentVP(x, y) + flowMap[id].vp(x, y);
    };
  });
  return velocityPotential;
};

function makeZData(velocityPotential, xSize, ySize) {
  const zData = [];
  for(let i = 0; i < ySize; i++) {
    zData.push([]);
    for(let j = 0; j < xSize; j++) {
      zData[i][j] = velocityPotential(j, i);
    }
  }
  return zData;
};

const makeData = (zData) => {
  return [{
    z: zData,
    type: 'contour',
    /*contours: {
      coloring: 'lines'
    },*/
    ncontours: 100,
    //colorscale: 'Greys',
    line: {
      smoothing: 1
    },
    connectgaps: true
  }]
};

const SIZE = 100;

const mapStateToProps = (state) => {
  return {
    activeFlowIds: state.flow.activeFlowIds,
    activeFlowMap: state.flow.activeFlowMap
  };
};

@connect(mapStateToProps)
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: {
        title: 'Potential Flow'
      }
    };
    this.activeFlowTimer = null;
  };

  componentDidMount() {
    this.renderNewPlot(this.graph, [], this.state.layout);
    const inputs = { U: 0, V: 1 };
    addFlow(UNIFORM, inputs, makeUniformVP(inputs));
  };

  componentWillReceiveProps(nextProps) {
    const { activeFlowIds, activeFlowMap } = nextProps;
    
    if(activeFlowIds !== this.props.activeFlowIds ||
      activeFlowMap !== this.props.activeFlowMap) {
      clearTimeout(this.activeFlowTimer);
      this.activeFlowTimer = setTimeout(() => {
        const vp = makeVelocityPotential(activeFlowIds, activeFlowMap);
        const zData = makeZData(vp, SIZE, SIZE);
        const newData = makeData(zData);
        this.renderNewPlot(this.graph, newData, this.state.layout);
      }, 300);
    }
  };

  renderNewPlot(node, data, layout) {
    Plotly.newPlot(node, data, layout);
  };

  render() {
    const { activeFlowIds, activeFlowMap } = this.props;

    return (
      <div className="flexbox">
        <div className="flex1" style={{padding: '0 12px'}}>
          <div className="flex0">
            <div ref={div => this.graph = div}
              style={{
                width: '800px',
                height: '500px',
                margin: 'auto'
              }}></div>
          </div>
          <div>
            <h4>Add Flow Source</h4>
            <Uniform/>
            <PointSource/>
            <PointVortex/>
            <Dipole/>
          </div>
        </div>
        <div className="flex0 active-flows">
          <h4>Current Flows &middot; {activeFlowIds.length}</h4>
          { activeFlowIds.map((id, i) => {
            const flow = activeFlowMap[id];
            switch(flow.type) {
              case UNIFORM:
                return <Uniform key={i} {...flow}/>;
              case POINT_SOURCE:
                return <PointSource key={i} {...flow}/>;
              case POINT_VORTEX:
                return <PointVortex key={i} {...flow}/>;
              case DIPOLE:
                return <Dipole key={i} {...flow}/>;
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };
};