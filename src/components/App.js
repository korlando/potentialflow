import React, { Component } from 'react';
import { connect } from 'react-redux';
import CloseButton from './CloseButton';
import Uniform, { makeUniformFlowFcns } from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';
import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';
import { addFlow } from '../util';

const SIZE = 100;

/**
 * Generate custom X and Y array scales
 * centered around the origin.
 * @param {Number} xSize the number of x points
 * @param {Number} ySize the number of y points
 * @return {Object} map from xCoords and yCoords 
 *         to their respective coordinate arrays
 */
const generateXY = (xSize, ySize) => {
  const x = [],
        y = [];
  const xOffset = Math.round(xSize / 2),
        yOffset = Math.round(ySize / 2);

  for(let i = 0; i < xSize; i++) {
    x.push(i - xOffset);
  }
  for(let i = 0; i < ySize; i++) {
    y.push(i - yOffset);
  }

  return {
    xCoords: x,
    yCoords: y
  };
};

const coordinates = generateXY(SIZE, SIZE);
const { xCoords, yCoords } = coordinates;

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
      return currentVP(x, y) + flowMap[id].flowFcns.vp(x, y);
    };
  });
  return velocityPotential;
};

/**
 * Generate the z data for a contour plot.
 * @param {function} zFcn a function of (x, y)
 *        to get the z data
 * @param xCoords the x coordinates to plot
 * @param yCoords the y coordinates to plot
 * @return {Array} the z data, an array of arrays
 *         where zData[j][i] corresponds to the z
 *         value of (xCoords[i], yCoords[j])
 */
function makeZData(zFcn, xCoords, yCoords) {
  const zData = [];
  
  yCoords.forEach((y, j) => {
    zData.push([]);
    
    xCoords.forEach((x, i) => {
      zData[j][i] = zFcn(x, y);
    });
  });
  return zData;
};

const makeData = (zData) => {
  return [{
    z: zData,
    x: xCoords,
    y: yCoords,
    type: 'contour',
    contours: {
      coloring: 'lines'
    },
    ncontours: 100,
    //colorscale: 'Greys',
    line: {
      smoothing: 1
    },
    connectgaps: true
  }]
};

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
    addFlow(UNIFORM, inputs, makeUniformFlowFcns(inputs));
  };

  componentWillReceiveProps(nextProps) {
    const { activeFlowIds, activeFlowMap } = nextProps;
    
    if(activeFlowIds !== this.props.activeFlowIds ||
      activeFlowMap !== this.props.activeFlowMap) {
      clearTimeout(this.activeFlowTimer);
      this.activeFlowTimer = setTimeout(() => {
        const vp = makeVelocityPotential(activeFlowIds, activeFlowMap);
        const zData = makeZData(vp, xCoords, yCoords);
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