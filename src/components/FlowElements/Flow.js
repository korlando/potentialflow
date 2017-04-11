import React, { Component } from 'react';
import { connect } from 'react-redux';
import CloseButton from '../CloseButton';
import { addFlow, editFlow, editFlowForm, removeFlow } from '../../util';
import variableMeta from '../../constants/variableMeta';

const mapStateToProps = (state, ownProps) => {
  return {
    flow: ownProps.flowId !== undefined ?
      state.flow.activeFlowMap[ownProps.flowId] :
      state.flow.flowForms[ownProps.type]
  };
};

@connect(mapStateToProps)
export default class Flow extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(key, value) {
    const { flowId, flow, type, makeFlowFcns } = this.props;
    const inputChanges = {
      [key]: value === '' ? value : Number(value)
    };

    if(flowId !== undefined) {
      const newInputs = Object.assign({}, flow.inputs, inputChanges);
      editFlow(flowId, inputChanges, makeFlowFcns(newInputs));
    } else {
      editFlowForm(type, inputChanges);
    }
  };

  handleSubmit(e) {
    e.preventDefault();

    const { flowId, flow, makeFlowFcns, type } = this.props;
    if(flowId === undefined) {
      addFlow(type, flow.inputs, makeFlowFcns(flow.inputs));
    }
  };

  render() {
    const { name,
            className,
            style,
            flowId,
            flow } = this.props;

    return (
      <div className={`flow-element ${className || ''}`}
        style={style || {}}>
        <div className="flexbox">
          <label className="flex1">{name}</label>
          { flowId !== undefined &&
            <CloseButton
              className="flex0"
              onClick={() => removeFlow(flowId)}/>
          }
        </div>
        <form onSubmit={this.handleSubmit}>
          { Object.keys(flow.inputs).map((key, i) => {
            const variable = variableMeta[key];
            return (
              <div key={i} className="input-group input-group-sm">
                <div className="input-group-addon"
                  title={variable.placeholder}>{variable.name}</div>
                <input type="number"
                  className="form-control"
                  placeholder={variable.placeholder}
                  value={flow.inputs[key]}
                  onChange={(e) => {
                    this.handleChange(key, e.target.value);
                  }}/>
              </div>
            );
          })}
          { flowId === undefined &&
            <button type="submit"
              className="btn btn-primary btn-block btn-sm">Add</button>
          }
        </form>
      </div>
    );
  };
};