import React, { Component } from 'react';
import { connect } from 'react-redux';
import CloseButton from './CloseButton';
import Uniform, { makeUniformFlowFcns,
                  uniformFlowStrs } from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';
import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';
import { addFlow, editFlowView } from '../util';
import flowToTeX from '../constants/flowToTeX';
import TeX from './TeX';

const SIZE = 100;
const flowViewColorScales = {
  vp: 'YIOrRd',
  stream: 'YIGnBu'
};

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

function makeFlowFcn(name, flowIds, flowMap) {
  let fcn = (x, y) => 0;
  flowIds.forEach((id) => {
    const currentFcn = fcn;
    fcn = (x, y) => {
      return currentFcn(x, y) + flowMap[id].flowFcns[name](x, y);
    };
  });
  return fcn;
};

function makeFlowStr(name, flowIds, flowMap) {
  let str = `${flowToTeX[name]} = `;
  flowIds.forEach((id, i) => {
    str += flowMap[id].flowStrs[name];
    if(i !== flowIds.length - 1) {
      str += ' + ';
    }
  });
  return str;
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

const makeData = (zData, flowView) => {
  return [{
    z: zData,
    x: xCoords,
    y: yCoords,
    type: 'contour',
    contours: {
      coloring: 'lines'
    },
    ncontours: 80,
    colorscale: flowViewColorScales[flowView],
    line: {
      smoothing: 1.3,
      width: 1.5
    },
    connectgaps: true
  }]
};

const layout = {
  margin: {
    t: 40,
    l: 30,
    r: 20,
    b: 20
  }
};

const mapStateToProps = (state) => {
  return {
    activeFlowIds: state.flow.activeFlowIds,
    activeFlowMap: state.flow.activeFlowMap,
    flowView: state.flow.flowView
  };
};

@connect(mapStateToProps)
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flowFcnName: 'vp',
      flowStr: ''
    };
    this.activeFlowTimer = null;
  };

  componentDidMount() {
    this.renderNewPlot(this.graph, [], layout);
    const inputs = { U: 0, V: 1 };
    addFlow(UNIFORM, inputs, makeUniformFlowFcns(inputs), uniformFlowStrs(inputs));
  };

  componentWillReceiveProps(nextProps) {
    const { activeFlowIds, activeFlowMap, flowView } = nextProps;
    
    if(activeFlowIds !== this.props.activeFlowIds ||
      activeFlowMap !== this.props.activeFlowMap ||
      flowView !== this.props.flowView) {
      clearTimeout(this.activeFlowTimer);
      
      this.activeFlowTimer = setTimeout(() => {
        const flowFcn = makeFlowFcn(flowView, activeFlowIds, activeFlowMap);
        const zData = makeZData(flowFcn, xCoords, yCoords);
        const newData = makeData(zData, flowView);
        this.renderNewPlot(this.graph, newData, layout);

        const flowStr = makeFlowStr(flowView, activeFlowIds, activeFlowMap);
        this.setState({ flowStr });
      }, 300);
    }
  };

  renderNewPlot(node, data, layout) {
    Plotly.newPlot(node, data, layout);
  };

  render() {
    const { activeFlowIds,
            activeFlowMap,
            flowView } = this.props;
    const { flowStr } = this.state;

    return (
      <div className="flexbox">
        <div className="flex1 view-container">
          <div className="flex0">
            <h1>Potential Flow</h1>
            <div ref={div => this.graph = div}
              style={{
                width: '800px',
                height: '500px',
                margin: 'auto'
              }}></div>
              <div className="flexbox align-items-center" style={{
                minHeight: '40px',
                padding: '5px 0'
              }}>
                <div className="flex1"></div>
                <div className="flex0">
                  { flowStr &&
                    <div className="flow-eq main-flow-eq">
                      <TeX value={flowStr}/>
                    </div>
                  }
                </div>
                <div className="flex0">
                  <select
                    className="form-control"
                    value={flowView}
                    onChange={e => editFlowView(e.target.value)}>
                    <option value="vp">Velocity Potential</option>
                    <option value="stream">Stream Function</option>
                    <option value="xVel">X Velocity</option>
                    <option value="yVel">Y Velocity</option>
                  </select>
                </div>
              </div>
          </div>
          <div>
            <h4>Add Flow Element</h4>
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