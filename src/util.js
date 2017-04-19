import * as flowActions from './actions/flowActions';
import store from './store/store';

export const addFlow = (type, inputs, flowFcns, flowStrs) => {
  store.dispatch(flowActions.addFlow({ type, inputs, flowFcns, flowStrs }));
};

export const addBulkFlows = (flows, name) => {
  store.dispatch(flowActions.addBulkFlows({ flows, name }));
};

export const editFlow = (flowId, inputChanges, flowFcns, flowStrs) => {
  store.dispatch(flowActions.editFlow(flowId, inputChanges, flowFcns, flowStrs));
};

export const editFlowForm = (flowType, inputChanges) => {
  store.dispatch(flowActions.editFlowForm(flowType, inputChanges));
};

export const removeFlow = (flowId) => {
  store.dispatch(flowActions.removeFlow(flowId));
};

export const editFlowView = (view) => {
  store.dispatch(flowActions.editFlowView(view));
};

export const undoFlowHistory = () => {
  store.dispatch(flowActions.undoFlowHistory());
};

export const redoFlowHistory = () => {
  store.dispatch(flowActions.redoFlowHistory());
};

export const diffTeX = (first, second) => {
  if(second < 0) {
    return `${first} + ${-second}`;
  } else if(!second) {
    return first;
  }
  return `${first} - ${second}`;
};

export const fracTeX = (numerator, denominator) => {
  return `\\frac{${numerator}}{${denominator}}`;
};

export const sqrtTeX = (x) => {
  return `\\sqrt[]{${x}}`;
};

export const radiusSqTeX = (x0, y0) => {
  return `(${diffTeX('x', x0)})^2 + (${diffTeX('y', y0)})^2`;
};

export const radiusTeX = (x0, y0) => {
  return sqrtTeX(radiusSqTeX(x0, y0));
};

export const over2PiTeX = (x) => {
  return fracTeX(x, '2\\pi');
};

export const getRadiusSq = (xDiff, yDiff) => {
  return Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
};

export const getRadius = (xDiff, yDiff) => {
  return Math.sqrt(getRadiusSq(xDiff, yDiff));
};

export const over2Pi = (x) => {
  return x / (2 * Math.PI);
};