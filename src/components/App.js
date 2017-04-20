import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFlow } from '../util';
import TeX from './TeX';
import Nav from './Nav';
import ActiveFlowsPanel from './ActiveFlowsPanel';

import Uniform from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';
import Dipole from './FlowElements/Dipole';

import RankineHalfbody from './FlowElements/Preset/RankineHalfbody';
import RankineOval from './FlowElements/Preset/RankineOval';
import Cylinder from './FlowElements/Preset/Cylinder';
import RotatingCylinder from './FlowElements/Preset/RotatingCylinder';

import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';
import flowToTeX from '../constants/flowToTeX';

const SIZE = 100;
const flowViewColorScales = {
  vp: 'YIOrRd',
  stream: 'YIGnBu'
};
const flowNavOptions = [{
  name: 'Add Preset',
  value: 'preset'
}, {
  name: 'Add Custom',
  value: 'custom'
}, {
  name: 'Inspect Flows',
  value: 'inspect'
}];

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

function makeFlowFcn(name, flowIds, flowMap) {
  let fcn = (x, y) => 0;
  flowIds.forEach((id) => {
    const currentFcn = fcn;
    fcn = (x, y) => {
      const flow = flowMap[id];
      let additional;
      if(flow.group) {
        additional = makeFlowFcn(name, flow.flowIds, flowMap)(x, y);
      } else {
        additional = flow.flowFcns[name](x, y);
      }
      return currentFcn(x, y) + additional;
    };
  });
  return fcn;
};

function makeFlowStr(name, flowIds, flowMap, noLeftSide) {
  let str = noLeftSide ? '' : `${flowToTeX[name]} = `;
  if(flowIds.length === 0) {
    return str + '0';
  }

  const strs = [];
  flowIds.forEach((id, i) => {
    const flow = flowMap[id];
    if(flow.group) {
      strs.push(makeFlowStr(name, flow.flowIds, flowMap, true));
    } else {
      strs.push(flow.flowStrs[name]);
    }
  });

  for(let i = 0; i < strs.length; i++) {
    str += strs[i];
    if(i !== strs.length - 1) {
      str += (strs[i + 1][0] === '-') ? ' ' : ' + ';
    }
  }
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

function makeFlowFcnMap(activeFlowIds, activeFlowMap) {
  const flowFcnMap = {};
  Object.keys(flowToTeX).forEach((key) => {
    flowFcnMap[key] = makeFlowFcn(key, activeFlowIds, activeFlowMap);
  });
  return flowFcnMap;
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
      flowFcnName: 'stream',
      flowStr: makeFlowStr('stream', [], {}),
      flowFcnMap: makeFlowFcnMap([], {}),
      addMode: 'preset',
      inspectX: 0,
      inspectY: 0
    };
    this.activeFlowTimer = null;
  };

  componentDidMount() {
    const zData = makeZData(() => 0, xCoords, yCoords);
    const data = makeData(zData, this.props.flowView);
    this.renderNewPlot(this.graph, data, layout);
  };

  componentWillReceiveProps(nextProps) {
    const { activeFlowIds, activeFlowMap, flowView } = nextProps;
    
    if(activeFlowIds !== this.props.activeFlowIds ||
      activeFlowMap !== this.props.activeFlowMap ||
      flowView !== this.props.flowView) {
      clearTimeout(this.activeFlowTimer);
      
      this.activeFlowTimer = setTimeout(() => {
        const flowFcnMap = makeFlowFcnMap(activeFlowIds, activeFlowMap);
        const flowFcn = flowFcnMap[flowView];
        const zData = makeZData(flowFcn, xCoords, yCoords);
        const newData = makeData(zData, flowView);
        this.renderNewPlot(this.graph, newData, layout);

        const flowStr = makeFlowStr(flowView, activeFlowIds, activeFlowMap);
        this.setState({ flowStr, flowFcnMap });
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
    const { flowStr,
            flowFcnMap,
            addMode,
            inspectX,
            inspectY } = this.state;

    return (
      <div className="flexbox">
        <div className="flex1" style={{ position: 'relative' }}>
          <Nav/>
          <div className="view-container">
            <div style={{ overflowX: 'auto'}}>
              <div ref={div => this.graph = div}
                style={{
                  width: '800px',
                  height: '500px',
                  margin: 'auto'
                }}></div>
            </div>

            <div className="flexbox justify-content-center" style={{
              minHeight: '67px',
              padding: '10px'
            }}>
              { flowStr &&
                <div className="flow-eq main-flow-eq">
                  <TeX value={flowStr}/>
                </div>
              }
            </div>

            <h4 style={{ padding: '0 12px'}}>Flow Elements</h4>
            
            <div className="flow-nav flexbox">
              { flowNavOptions.map((o, i) => {
                return (
                  <div key={i}
                    className={`option ${addMode === o.value ? ' active' : ''}`}
                    onClick={(e) => {
                      if(addMode !== o.value) {
                        this.setState({ addMode: o.value });
                      }
                    }}>{o.name}</div>
                );
              })}
            </div>
            
            <div style={{ padding: '12px' }}>
              <div className={addMode !== 'preset' && 'display-none'}>
                <RankineHalfbody/>
                <RankineOval/>
                <Cylinder/>
                <RotatingCylinder/>
              </div>
              
              <div className={addMode !== 'custom' && 'display-none'}>
                <Uniform/>
                <PointSource/>
                <PointVortex/>
                <Dipole/>
              </div>

              <div className={`flexbox ${addMode !== 'inspect' && 'display-none'}`}>
                <div className="flex0" style={{ paddingRight: '12px' }}>
                  <div className="input-group" style={{ marginBottom: '5px' }}>
                    <div className="input-group-addon">x</div>
                    <input type="number"
                      className="form-control"
                      value={inspectX}
                      onChange={e => this.setState({ inspectX: e.target.value })}
                      placeholder="X position"/>
                  </div>
                  <div className="input-group">
                    <div className="input-group-addon">y</div>
                    <input type="number"
                      className="form-control"
                      value={inspectY}
                      onChange={e => this.setState({ inspectY: e.target.value })}
                      placeholder="Y position"/>
                  </div>
                </div>

                <div className="flex0">
                  { Object.keys(flowToTeX).map((key) => {
                    return <TeX value={`${flowToTeX[key]} = ${flowFcnMap[key](inspectX, inspectY)}`}/>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ActiveFlowsPanel/>
      </div>
    );
  };
};