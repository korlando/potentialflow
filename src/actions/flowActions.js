export const addFlow = (flow) => {
  return {
    type: 'ADD_FLOW',
    flow
  };
};

export const editFlow = (flowId, inputChanges, flowFcns) => {
  return {
    type: 'EDIT_FLOW',
    flowId,
    inputChanges,
    flowFcns
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