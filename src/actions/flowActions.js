export const addFlow = (flow) => {
  return {
    type: 'ADD_FLOW',
    flow
  };
};

export const addBulkFlows = (flowGroup) => {
  return {
    'type': 'ADD_BULK_FLOWS',
    flowGroup
  };
};

export const editFlow = (flowId, inputChanges, flowFcns, flowStrs) => {
  return {
    type: 'EDIT_FLOW',
    flowId,
    inputChanges,
    flowFcns,
    flowStrs
  };
};

export const editFlowForm = (flowType, inputChanges) => {
  return {
    type: 'EDIT_FLOW_FORM',
    flowType,
    inputChanges
  };
};

export const removeFlow = (flowId) => {
  return {
    type: 'REMOVE_FLOW',
    flowId
  };
};

export const editFlowView = (view) => {
  return {
    type: 'EDIT_FLOW_VIEW',
    view
  };
};

export const undoFlowHistory = () => {
  return {
    type: 'UNDO_FLOW_HISTORY'
  };
};

export const redoFlowHistory = () => {
  return {
    type: 'REDO_FLOW_HISTORY'
  };
};