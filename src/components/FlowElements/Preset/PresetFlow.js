import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addBulkFlows } from '../../../util';
import { addAlert } from '../../../alert';
import TeX from '../../TeX';
import flowToTeX from '../../../constants/flowToTeX';
import variableMeta from '../../../constants/variableMeta';

const mapStateToProps = state => ({
  flowView: state.flow.flowView,
});

class PresetFlow extends Component {
  render() {
    const { name, flows, flowView } = this.props;
    return (
      <div className="flow-element d-flex flex-column">
        <label>{name}</label>
        <div className="text-grey" style={{ fontSize: '10px' }}>Elements</div>
        <div className="flow-eq flex1">
        { flows.map((flow, i) => (
          <div key={i} className="text-grey"
            style={{ marginBottom: i < flows.length - 1 ? '10px' : '0' }}>
            {flow.name}
            <div style={{ fontSize: '12px' }}>
              <TeX value={flowToTeX[flowView] + '(x, y) = ' + flow.flowStrs[flowView]}/>
            </div>
          </div>
        ))}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block btn-sm"
          onClick={() => {
            addBulkFlows(flows, name);
            addAlert(`Added "${name}" Flow`, true, 10 * 1000);
          }}
        >
          Add
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PresetFlow);
