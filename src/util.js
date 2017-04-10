import * as flowActions from './actions/flowActions';
import store from './store/store';

export const addFlow = (type, inputs, vp) => {
  store.dispatch(flowActions.addFlow({ type, inputs, vp }));
};

export const editFlow = (flowId, inputChanges) => {
  store.dispatch(flowActions.editFlow(flowId, inputChanges));
};

export const editFlowForm = (flowType, inputChanges) => {
  store.dispatch(flowActions.editFlowForm(flowType, inputChanges));
};

export const removeFlow = (flowId) => {
  store.dispatch(flowActions.removeFlow(flowId));
};