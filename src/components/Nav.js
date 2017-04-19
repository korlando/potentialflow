import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { removeAlert } from '../alert';
import { undoFlowHistory,
         redoFlowHistory,
         editFlowView } from '../util';
import CloseButton from './CloseButton';

const mapStateToProps = (state) => {
  return {
    alerts: state.alert.alerts,
    historyIndex: state.flow.historyIndex,
    history: state.flow.history,
    flowView: state.flow.flowView
  };
};

@connect(mapStateToProps)
export default class Nav extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { historyIndex,
            history,
            alerts,
            flowView } = this.props;

    return (
      <nav className="flexbox align-items-center">
        <label className="flex1" style={{ margin: '0' }}>
          Potential Flow
        </label>
        <ReactCSSTransitionGroup
          transitionName="alert-box"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          { alerts.map((alert) => {
            return (
              <div key={alert.id}
                className="alert-box flexbox align-items-center">
                <div style={{ marginRight: '15px' }}>{alert.text}</div>
                { alert.undo &&
                  <div className="undo flex0" onClick={() => {
                    removeAlert(alert.id);
                    undoFlowHistory();
                  }}>UNDO</div>
                }
                <CloseButton className="flex0"
                  onClick={() => {
                    removeAlert(alert.id);
                  }}/>
              </div>
            );
          })}
        </ReactCSSTransitionGroup>
        <div className="flex0" style={{ paddingRight: '12px' }}>
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
        <button className="history-btn flex0"
          title="Undo"
          disabled={historyIndex <= 0}
          onClick={undoFlowHistory}>
          <span className="lnr lnr-undo"></span>
        </button>
        <button className="history-btn flex0"
          title="Redo"
          disabled={historyIndex >= history.length - 1}
          onClick={redoFlowHistory}>
          <span className="lnr lnr-redo"></span>
        </button>
      </nav>
    );
  };
};