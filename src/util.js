import * as flowActions from './actions/flowActions';
import store from './store/store';

export const addFlow = (type, inputs, flowFcns) => {
  store.dispatch(flowActions.addFlow({ type, inputs, flowFcns }));
};

export const editFlow = (flowId, inputChanges, flowFcns) => {
  store.dispatch(flowActions.editFlow(flowId, inputChanges, flowFcns));
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

export const fracTeX = (numerator, denominator) => {
  return `\\frac{numerator}{denominator}`;
};

export const sqrtTeX = (x) => {
  return `\\sqrt[](x)`;
};

export const radiusSqTeX = (x0, y0) => {
  const xDiff = x0 < 0 ? `x + ${-x0}` : `x - ${x0}`;
  const yDiff = y0 < 0 ? `y + ${-y0}` : `y - ${y0}`;
  return `(${xDiff})^2 + (${yDiff})^2`;
};

export const radiusTeX = (x0, y0) => {
  return sqrtTeX(radiusSqTeX(x0, y0));
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