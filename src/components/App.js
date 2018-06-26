import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  bootstrapFlows,
  encodeSearchString, 
  decodeSearchString,
} from '../util';
import TeX from './TeX';
import Nav from './Nav';
import ActiveFlowsPanel from './ActiveFlowsPanel';

import Uniform from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';
import Corner from './FlowElements/Corner';

import RankineHalfbody from './FlowElements/Preset/RankineHalfbody';
import RankineOval from './FlowElements/Preset/RankineOval';
import Cylinder from './FlowElements/Preset/Cylinder';
import RotatingCylinder from './FlowElements/Preset/RotatingCylinder';

import {
  UNIFORM,
  POINT_SOURCE,
  POINT_VORTEX,
  DIPOLE,
  CORNER,
} from '../constants/flowTypes';
import flowToTeX from '../constants/flowToTeX';

const SIZE = 20;
const flowViewColorScales = {
  vp: 'YIOrRd',
  stream: 'YIGnBu',
};
const flowNavOptions = [{
  name: 'Add Preset',
  value: 'preset',
}, {
  name: 'Add Custom',
  value: 'custom'
}, {
  name: 'Inspect Flow',
  value: 'inspect',
}];

/**
 * Generate custom X and Y array scales
 * centered around the origin.
 * @param {Number} xSize the number of x points
 * @param {Number} ySize the number of y points
 * @return {Object} map from xCoords and yCoords 
 *         to their respective coordinate arrays
 */
const generateXY = (xSize, xStart, ySize, yStart) => {
  const x = [];
  const y = [];
  for (let i = 0; i < xSize; i += 0.25) {
    x.push(i + xStart);
  }
  for (let i = 0; i < ySize; i += 0.25) {
    y.push(i + yStart);
  }
  return {
    xCoords: x,
    yCoords: y,
  };
};

let coordinates = generateXY(SIZE, -SIZE / 2, SIZE, -SIZE / 2);
let { xCoords, yCoords } = coordinates;

/**
 * Generate the overall active flow function given a key.
 * Assumes all objects in flowMap have the appropriate
 * sub-function on (x, y) for the key.
 * 
 * @param {String} key the flow function key; can be:
 *   'vp', 'stream', 'xVel', 'yVel'
 * @param {Array} flowIds active flow IDs
 * @param {Object} flowMap map from flow ID to flow object
 * @return {Function} function on (x, y) corresponding to 
 *         the provided key
 */
const makeFlowFcn = (key, flowIds, flowMap) => {
  let fcn = (x, y) => 0;
  flowIds.forEach((id) => {
    const currentFcn = fcn;
    const flow = flowMap[id];
    fcn = (x, y) => {
      let additional;
      if (flow.group) {
        additional = makeFlowFcn(key, flow.flowIds, flowMap)(x, y);
      } else {
        additional = flow.flowFcns[key](x, y);
      }
      return currentFcn(x, y) + additional;
    };
  });
  return fcn;
};

/**
 * Generate a string representation of the active
 * flow equation in TeX format.
 *
 * @param {String} key the flow function key; can be:
 *   'vp', 'stream', 'xVel', 'yVel'
 * @param {Array} flowIds active flow IDs
 * @param {Object} flowMap map from flow ID to flow object
 * @param {Boolean} noLeftSide toggle whether to include 
 *        the function name followed by '='
 * @return {String} TeX formatted equation
 */
const makeFlowStr = (key, flowIds, flowMap, noLeftSide) => {
  let str = noLeftSide ? '' : `${flowToTeX[key]}(x, y) = `;
  if (flowIds.length === 0) {
    return str + '0';
  }

  const strs = [];
  flowIds.forEach((id, i) => {
    const flow = flowMap[id];
    if (flow.group) {
      strs.push(makeFlowStr(key, flow.flowIds, flowMap, true));
    } else {
      strs.push(flow.flowStrs[key]);
    }
  });

  for (let i = 0; i < strs.length; i++) {
    str += strs[i];
    if (i !== strs.length - 1) {
      str += (strs[i + 1][0] === '-') ? ' ' : ' + ';
    }
  }
  return str;
};

const makeVelocityMagnitudeFcn = (xVelFcn, yVelFcn) =>
  (x, y) =>
    Math.sqrt(Math.pow(xVelFcn(x, y), 2) + Math.pow(yVelFcn(x, y), 2));

const makeUniformVelocityMagnitude = (flowIds, flowMap) => {
  let USum = 0;
  let VSum = 0;
  flowIds.forEach((id) => {
    const flow = flowMap[id];
    if (flow.type === UNIFORM) {
      USum += flow.inputs.U;
      VSum += flow.inputs.V;
    }
  });
  return makeVelocityMagnitudeFcn((x, y) => USum, (x, y) => VSum);
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
const makeZData = (zFcn, xCoords, yCoords) => {
  const zData = [];
  yCoords.forEach((y, j) => {
    zData.push([]);
    xCoords.forEach((x, i) => {
      zData[j][i] = zFcn(x, y);
    });
  });
  return zData;
};

const makeFlowFcnMap = (activeFlowIds, activeFlowMap) => {
  const flowFcnMap = {};
  Object.keys(flowToTeX).forEach((key) => {
    flowFcnMap[key] = makeFlowFcn(key, activeFlowIds, activeFlowMap);
  });
  return flowFcnMap;
};

/**
 * Generate Plotly contour plot data.
 * @param {Array} zData array of arrays 
 *        representing the Z data of the contours
 * @param flowView currently viewed flow equation;
 *        affects colorscale of the plot
 * @return Plotly data, fit for a contour plot
 */
const makeData = (zData, flowView) =>
  [{
    z: zData,
    x: xCoords,
    y: yCoords,
    type: 'contour',
    contours: {
      coloring: 'lines',
    },
    ncontours: 50,
    colorscale: flowViewColorScales[flowView],
    line: {
      smoothing: 0.6,
      width: 1.5,
    },
    connectgaps: true,
  }];

const layout = {
  margin: {
    t: 40,
    l: 35,
    r: 20,
    b: 20,
  },
};

const config = {
  modeBarButtonsToRemove: [
    'toggleSpikelines',
    'hoverClosestCartesian',
    'hoverCompareCartesian',
  ],
  displaylogo: false,
  displayModeBar: true,
};

const hasActiveCornerFlow = (flowIds, flowMap) =>
  flowIds.find(id => flowMap[id].type === CORNER) !== undefined;

const mapStateToProps = state => ({
  activeFlowIds: state.flow.activeFlowIds,
  activeFlowMap: state.flow.activeFlowMap,
  flowView: state.flow.flowView,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowFcnName: 'stream',
      flowStr: makeFlowStr('stream', [], {}),
      flowFcnMap: makeFlowFcnMap([], {}),
      addMode: 'preset',
      inspectX: 0,
      inspectY: 0,
      farFieldPressure: 0,
      farFieldActive: false,
      referencePressure: 0,
      referencePressureX: 0,
      referencePressureY: 0,
      density: 0,
    };
    this.activeFlowTimer = null;
    this.prevXSize = SIZE;
    this.prevYSize = SIZE;
    this.prevXStart = -SIZE / 2;
    this.prevYStart = -SIZE / 2;
  }

  componentDidMount() {
    const { location, flowView } = this.props;
    if (location.search) {
      const decoded = decodeSearchString(location.search.replace('?', ''));
      const { flowIds, flowMap, maxIndex } = decoded;
      bootstrapFlows(flowIds, flowMap, maxIndex);
    } else {
      const zData = makeZData(() => 0, xCoords, yCoords);
      const data = makeData(zData, this.props.flowView);
      this.renderNewPlot(this.graph, data, layout);
    }
    this.$mainNav = $('.main-nav');
    this.$appContainer = $('.app-container');
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    const {
      activeFlowIds,
      activeFlowMap,
      flowView,
      history,
    } = nextProps;

    // disable farFieldPressure if a corner flow was added
    if (
      this.state.farFieldActive &&
      hasActiveCornerFlow(activeFlowIds, activeFlowMap) &&
      !hasActiveCornerFlow(this.props.activeFlowIds, this.props.activeFlowMap)
    ) {
      this.setState({ farFieldActive: false });
    }
    
    if (
      activeFlowIds !== this.props.activeFlowIds ||
      activeFlowMap !== this.props.activeFlowMap ||
      flowView !== this.props.flowView
    ) {
      clearTimeout(this.activeFlowTimer);
      this.activeFlowTimer = setTimeout(() => {
        this.applyData(flowView, activeFlowIds, activeFlowMap);
        if (activeFlowIds.length === 0) {
          history.push('/');
        } else {
          history.push(`/?${encodeSearchString(activeFlowIds, activeFlowMap)}`);
        }
      }, 300);
    }
  }

  applyData = (flowView, flowIds, flowMap) => {
    const flowFcnMap = makeFlowFcnMap(flowIds, flowMap);
    const flowFcn = flowFcnMap[flowView];
    const zData = makeZData(flowFcn, xCoords, yCoords);
    const newData = makeData(zData, flowView);
    this.renderNewPlot(this.graph, newData, layout);

    const flowStr = makeFlowStr(flowView, flowIds, flowMap);
    this.setState({ flowStr, flowFcnMap });
  };

  handleResize = () => {
    this.$appContainer.height($(window).height() - this.$mainNav.height());
    this.setState({ graphSize: this.graph.clientWidth - 80 });
    setTimeout(() => {
      Plotly.Plots.resize(this.graph);
    });
  };

  calculatePressure = () => {
    const {
      activeFlowIds,
      activeFlowMap,
    } = this.props;
    const {
      farFieldPressure,
      farFieldActive,
      density,
      flowFcnMap,
      inspectX,
      inspectY,
      referencePressure,
      referencePressureX,
      referencePressureY,
    } = this.state;
    const uniformVelMag = makeUniformVelocityMagnitude(activeFlowIds, activeFlowMap);
    const xVelFcn = flowFcnMap['xVel'];
    const yVelFcn = flowFcnMap['yVel'];
    const velocityMagnitudeFcn = makeVelocityMagnitudeFcn(xVelFcn, yVelFcn);
    const inspectVelocity = velocityMagnitudeFcn(Number(inspectX), Number(inspectY));
    
    if (farFieldActive) {
      if (Number(density) === 0) {
        return Number(farFieldPressure);
      }
      return (
        Number(farFieldPressure) +
        0.5 * Number(density) * (
          Math.pow(uniformVelMag(Number(inspectX), Number(inspectY)), 2) - Math.pow(inspectVelocity, 2)
        )
      );
    }

    const term1 = Math.pow(velocityMagnitudeFcn(Number(referencePressureX), Number(referencePressureY)), 2);
    const term2 = Math.pow(inspectVelocity, 2);
    // handle Infinity - Infinity edge case
    const diff = (term1 === Infinity && term2 === Infinity) ? 0 : term1 - term2;
    // handle 0 * Infinity edge case
    if (Number(density) === 0) {
      return Number(referencePressure);
    }
    return Number(referencePressure) + 0.5 * Number(density) * diff;
  };

  renderNewPlot = (node, data, layout) => {
    Plotly.newPlot(node, data, layout, config);
    node.on('plotly_relayout', (e) => {
      let xSize;
      let ySize;
      let xStart;
      let yStart;
      if (e['xaxis.autorange'] && e['yaxis.autorange']) {
        xSize = SIZE;
        ySize = SIZE;
        xStart = -SIZE / 2;
        yStart = -SIZE / 2;
      } else {
        const x1 = e['xaxis.range[1]'];
        const x0 = e['xaxis.range[0]'];
        const y1 = e['yaxis.range[1]'];
        const y0 = e['yaxis.range[0]'];
        if (x1 === undefined || x0 === undefined) {
          xSize = this.prevXSize;
          xStart = this.prevXStart;
        } else {
          xSize = x1 - x0 + 2;
          xStart = Math.floor(x0);
        }
        if (y1 === undefined || y0 === undefined) {
          ySize = this.prevYSize;
          yStart = this.prevYStart;
        } else {
          ySize = y1 - y0 + 2;
          yStart = Math.floor(y0);
        }
      }
      this.prevXSize = xSize;
      this.prevYSize = ySize;
      this.prevXStart = xStart;
      this.prevYStart = yStart;
      coordinates = generateXY(xSize, xStart, ySize, yStart);
      xCoords = coordinates.xCoords;
      yCoords = coordinates.yCoords;
      const { flowView, activeFlowIds, activeFlowMap } = this.props;
      this.applyData(flowView, activeFlowIds, activeFlowMap);
    });
  };

  render() {
    const {
      activeFlowIds,
      activeFlowMap,
      flowView,
    } = this.props;
    const {
      flowStr,
      flowFcnMap,
      addMode,
      inspectX,
      inspectY,
      farFieldPressure,
      farFieldActive,
      referencePressure,
      referencePressureX,
      referencePressureY,
      density,
      graphSize,
    } = this.state;
    const hasCornerFlow = hasActiveCornerFlow(activeFlowIds, activeFlowMap);

    return (
      <div className="d-flex app-container">
        <div className="flex0 main-panel">
          <Nav />
          <div className="view-container">
            <div id="graph" ref={node => this.graph = node}
              style={{
                width: '700px',
                maxWidth: '100%',
                height: graphSize + 'px',
                margin: 'auto',
              }}></div>

            <div className="d-flex justify-content-center" style={{
              minHeight: '60px',
              padding: '10px',
            }}>
              { flowStr &&
                <div className="flow-eq main-flow-eq d-flex align-items-center">
                  <TeX value={flowStr}/>
                </div>
              }
            </div>

            <h4 style={{ padding: '0 12px'}}>Flow Elements</h4>
            
            <div className="flow-nav d-flex">
              { flowNavOptions.map((o, i) => (
                <div
                  key={i}
                  className={`option ${addMode === o.value ? ' active' : ''}`}
                  onClick={(e) => {
                    if (addMode !== o.value) {
                      this.setState({ addMode: o.value });
                    }
                  }}
                >
                  {o.name}
                </div>
              ))}
            </div>

            <div className="p16" style={{ minHeight: '500px' }}>
              <div className={`d-flex flex-wrap align-items-stretch ${addMode !== 'preset' ? 'display-none' : ''}`}>
                <RankineHalfbody />
                <RankineOval />
                <Cylinder />
                <RotatingCylinder />
              </div>
              
              <div className={`d-flex flex-wrap align-items-stretch ${addMode !== 'custom' ? 'display-none' : ''}`}>
                <Uniform />
                <PointSource />
                <PointVortex />
                <Dipole />
                <Corner />
              </div>

              <div className={`inspect-flows ${addMode !== 'inspect' && 'display-none'}`}>
                <label>Enter a point (x, y)</label>
                <div className="d-flex mb32">
                  <div className="w50" style={{ paddingRight: '2px' }}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">x</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        value={inspectX}
                        onChange={e => this.setState({ inspectX: e.target.value })}
                        placeholder="X position"
                      />
                    </div>
                  </div>

                  <div className="w50" style={{paddingLeft: '2px'}}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">y</span>
                      </div>
                      <input type="number"
                        className="form-control"
                        value={inspectY}
                        onChange={e => this.setState({ inspectY: e.target.value })}
                        placeholder="Y position"/>
                    </div>
                  </div>
                </div>

                <div className="optional-container">
                  <hr/>
                  <div className="optional-text">OPTIONAL</div>
                </div>

                <div className="d-flex">
                  { !hasCornerFlow &&
                    <div
                      className={`flex1 ${farFieldActive ? '' : 'op6'}`}
                      onClick={() => {
                        if (!farFieldActive) {
                          this.setState({ farFieldActive: true });
                        }
                      }}
                    >
                      <label>Enter far field pressure</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">P<sub>&infin;</sub></span>
                        </div>
                        <input
                          type="number"
                          className="form-control"
                          value={farFieldPressure}
                          onChange={e => this.setState({
                            farFieldPressure: e.target.value,
                            farFieldActive: true,
                          })}
                          placeholder="Far Field Pressure"
                        />
                      </div>
                    </div>
                  }
                  { !hasCornerFlow &&
                    <div className="flex0 fs14 text-light" style={{ padding: '28px 16px' }}>OR</div>
                  }
                  <div
                    className={`flex1 ${farFieldActive ? 'op6' : ''}`}
                    onClick={() => {
                      if(farFieldActive) {
                        this.setState({ farFieldActive: false });
                      }
                    }}
                  >
                    <label>Enter pressure at a reference point</label>
                    <div className="input-group mb4">
                      <div className="input-group-prepend">
                        <span className="input-group-text">P</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        value={referencePressure}
                        onChange={e => this.setState({
                          referencePressure: e.target.value,
                          farFieldActive: false,
                        })}
                        placeholder="Reference Pressure"
                      />
                    </div>
                    <div className="input-group mb4">
                      <div className="input-group-prepend">
                        <span className="input-group-text">x</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        value={referencePressureX}
                        onChange={e => this.setState({
                          referencePressureX: e.target.value,
                          farFieldActive: false,
                        })}
                        placeholder="X position"
                      />
                    </div>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">y</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        value={referencePressureY}
                        onChange={e => this.setState({
                          referencePressureY: e.target.value,
                          farFieldActive: false,
                        })}
                        placeholder="Y position"
                      />
                    </div>
                  </div>
                </div>

                <label>Enter density for pressure calculation</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">&rho;</span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    value={density}
                    onChange={e => this.setState({ density: e.target.value })}
                    placeholder="Density"
                  />
                </div>
                
                <div className="row">
                  <div className="col-sm-6">
                    <h5 className="mt16">Flow at ({inspectX}, {inspectY})</h5>
                    <div className="flow-eq" style={{ height: '115px' }}>
                      { Object.keys(flowToTeX).map((key, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                          <TeX value={`${flowToTeX[key]} = ${Math.round(flowFcnMap[key](inspectX, inspectY) * 10000) / 10000}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <h5 className="mt16">Pressure at ({inspectX}, {inspectY})</h5>
                    <div className="flow-eq" style={{ height: '115px' }}>
                      <TeX value={`P = ${Math.round(this.calculatePressure() * 10000) / 10000}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ActiveFlowsPanel />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(App));
