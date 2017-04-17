import React, { Component } from 'react';
import { addBulkFlows } from '../../../util';
import variableMeta from '../../../constants/variableMeta';

export default class PresetFlow extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { name, flows } = this.props;
    return (
      <div className="flow-element">
        <label>{name}</label>
        { flows.map((flow, i) => {
          return (
            <div key={i} className="text-grey" style={{ marginBottom: '10px' }}>
              {flow.name}
              <div style={{ fontSize: '12px' }}>
                { Object.keys(flow.inputs).map((input, j) => {
                  return (
                    <span key={j} style={{ marginRight: '10px' }}>
                      {variableMeta[input].name} = {flow.inputs[input]}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="btn btn-primary btn-block btn-sm"
          onClick={() => {
            addBulkFlows(flows);
          }}>Add</button>
      </div>
    );
  };
};