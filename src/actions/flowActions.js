export const bootstrapFlows = (flowIds, flowMap, maxIndex) => ({
  type: 'BOOTSTRAP_FLOWS',
  flowIds,
  flowMap,
  maxIndex,
});

export const addFlow = flow => ({
  type: 'ADD_FLOW',
  flow,
});

export const addBulkFlows = flowGroup => ({
  type: 'ADD_BULK_FLOWS',
  flowGroup,
});

export const editFlow = (flowId, inputChanges, flowFcns, flowStrs) => ({
  type: 'EDIT_FLOW',
  flowId,
  inputChanges,
  flowFcns,
  flowStrs,
});

export const editFlowForm = (flowType, inputChanges) => ({
  type: 'EDIT_FLOW_FORM',
  flowType,
  inputChanges,
});

export const removeFlow = flowId => ({
  type: 'REMOVE_FLOW',
  flowId,
});

export const removeAllFlows = () => ({
  type: 'REMOVE_ALL_FLOWS',
});

export const editFlowView = view => ({
  type: 'EDIT_FLOW_VIEW',
  view,
});

export const undoFlowHistory = () => ({
  type: 'UNDO_FLOW_HISTORY',
});

export const redoFlowHistory = () => ({
  type: 'REDO_FLOW_HISTORY',
});
