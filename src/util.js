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