import React, { Component } from 'react';
import { connect } from 'react-redux';
import CloseButton from '../CloseButton';
import { addFlow, editFlow, editFlowForm, removeFlow } from '../../util';
import variableMeta from '../../constants/variableMeta';
import flowToTeX from '../../constants/flowToTeX';
import TeX from '../TeX';

const mapStateToProps = (state, ownProps) => {
  return {
    flow: ownProps.flowId !== undefined ?
      state.flow.activeFlowMap[ownProps.flowId] :
      state.flow.flowForms[ownProps.type],
    flowView: state.flow.flowView
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
    const { flowId,
            flow,
            type,
            makeFlowFcns,
            makeFlowStrs } = this.props;
    const inputChanges = {
      [key]: value === '' ? value : Number.parseFloat(value)
    };

    if(flowId !== undefined) {
      const newInputs = Object.assign({}, flow.inputs, inputChanges);
      editFlow(flowId, inputChanges, makeFlowFcns(newInputs), makeFlowStrs(newInputs));
    } else {
      editFlowForm(type, inputChanges);
    }
  };

  handleSubmit(e) {
    e.preventDefault();

    const { flowId,
            flow,
            makeFlowFcns,
            makeFlowStrs,
            type } = this.props;
    const { inputs } = flow;
    if(flowId === undefined) {
      addFlow(type, inputs, makeFlowFcns(inputs), makeFlowStrs(inputs));
    }
  };

  render() {
    const { name,
            type,
            className,
            style,
            flowId,
            flow,
            flowView,
            eqs } = this.props;

    return (
      <div className={`flow-element ${className || ''}`}
        style={style || {}}>
        <div className="flexbox">
          <label className="flex0">{name}</label>
          <div className="flex0">
            <img src={`images/${type}.svg`} width="25"/>
          </div>
          <div className="flex1"></div>
          { flowId !== undefined &&
            <CloseButton
              className="flex0"
              onClick={() => removeFlow(flowId)}/>
          }
        </div>

        <div className="flow-eq text-center">
          { Object.keys(eqs).map((key) => {
            return (
              <div key={key}
                className={flowView === key ? '' : 'display-none'}>
                <TeX value={flowToTeX[key] + ' = ' + eqs[key]}/>
              </div>
            );
          })}
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