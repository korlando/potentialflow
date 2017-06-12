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
  render() {
    const {
      historyIndex,
      history,
      alerts,
      flowView,
    } = this.props;
    const disableUndo = historyIndex <= 0;
    const disableRedo = historyIndex >= history.length - 1;

    return (
      <div className="nav-controls flexbox align-items-center">
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
        <div className="flex1"></div>
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
        <button className="blank flex0"
          title="Undo"
          disabled={disableUndo}
          onClick={undoFlowHistory}
          title={disableUndo ? '' : `Undo ${history[historyIndex].name}`}>
          <span className="lnr lnr-undo"></span>
        </button>
        <button className="blank flex0"
          title="Redo"
          disabled={disableRedo}
          onClick={redoFlowHistory}
          title={disableRedo ? '' : `Redo ${history[historyIndex + 1].name}`}>
          <span className="lnr lnr-redo"></span>
        </button>
      </div>
    );
  };
};