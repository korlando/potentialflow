import React, { Component } from 'react';
import CloseButton from './CloseButton';
import Uniform, { uniformVP } from './FlowElements/Uniform';
import PointSource from './FlowElements/PointSource';
import PointVortex from './FlowElements/PointVortex';

function makeVelocityPotential(elements) {
  let velocityPotential = (x, y) => 0;
  elements.forEach((element) => {
    const currentVP = velocityPotential;
    velocityPotential = (x, y) => {
      return currentVP(x, y) + element.vp(x, y);
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
    }
  }]
};

const SIZE = 100;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flows: [{
        component: Uniform,
        U: 0,
        V: 1,
        vp: uniformVP(0, 1)
      }],
      layout: {
        title: 'Potential Flow'
      }
    };
    this.addUniformFlow = this.addUniformFlow.bind(this);
    this.addPointSourceFlow = this.addPointSourceFlow.bind(this);
    this.addPointVortexFlow = this.addPointVortexFlow.bind(this);
  };

  componentDidMount() {
    const zData = makeZData(this.state.flows[0].vp, SIZE, SIZE);
    const data = makeData(zData);
    this.renderNewPlot(this.graph, data, this.state.layout);
  };

  componentDidUpdate() {
    const vp = makeVelocityPotential(this.state.flows);
    const zData = makeZData(vp, SIZE, SIZE);
    const newData = makeData(zData);
    this.renderNewPlot(this.graph, newData, this.state.layout);
  };

  renderNewPlot(node, data, layout) {
    Plotly.newPlot(node, data, layout);
  };

  addUniformFlow(U, V, vp) {
    this.setState({
      flows: [...this.state.flows, {
        component: Uniform,
        U, V, vp
      }]
    });
  };

  addPointSourceFlow(m, x0, y0, vp) {
    this.setState({
      flows: [...this.state.flows, {
        component: PointSource,
        m, x0, y0, vp
      }]
    });
  };

  addPointVortexFlow(gamma, x0, y0, vp) {
    this.setState({
      flows: [...this.state.flows, {
        component: PointVortex,
        gamma, x0, y0, vp
      }]
    });
  };

  render() {
    const sources = [{
      type: 'UNIFORM',
      component: Uniform,
      onAdd: (U, V, vp) => {
        this.addUniformFlow(U, V, vp);
      }
    }, {
      type: 'POINT_SOURCE',
      component: PointSource,
      onAdd: (m, x0, y0, vp) => {
        this.addPointSourceFlow(m, x0, y0, vp);
      }
    }, {
      type: 'POINT_VORTEX',
      component: PointVortex,
      onAdd: (gamma, x0, y0, vp) => {
        this.addPointVortexFlow(gamma, x0, y0, vp);
      }
    }];
    const { flows } = this.state;

    return (
      <div>
        <div className="container-fluid">
          <div className="flexbox">
            <div className="flex0">
              <div ref={div => this.graph = div}
                style={{
                  width: '800px',
                  height: '500px',
                  margin: 'auto'
                }}></div>
            </div>
            
            <div className="flex1" style={{paddingTop: '50px'}}>
              <h4>Current Flows &middot; {flows.length}</h4>
              { flows.map((flow, i) => {
                return (
                  <flow.component key={i}
                    {...flow}
                    onRemove={() => {
                      this.setState({
                        flows: flows.filter((f, j) => {
                          return j !== i;
                        })
                      });
                    }}/>
                );
              })}
            </div>
          </div>
          <div>
            <h4>Add Flow Source</h4>
            { sources.map((source, i) => {
              return (
                <source.component key={i} style={{
                  marginRight: '6px'
                }} onAdd={source.onAdd}/>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
};