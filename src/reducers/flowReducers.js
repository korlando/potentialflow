import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';

const defaultState = {
  activeFlowIds: [],
  activeFlowMap: {},
  flowView: 'stream',
  flowForms: {
    [UNIFORM]: {
      inputs: {
        U: 1,
        V: 1
      }
    },
    [POINT_SOURCE]: {
      inputs: {
        m: 100,
        x0: 0,
        y0: 0
      }
    },
    [POINT_VORTEX]: {
      inputs: {
        gamma: 100,
        x0: 0,
        y0: 0
      }
    },
    [DIPOLE]: {
      inputs: {
        mu: 100,
        x0: 0,
        y0: 0,
        alpha: 0
      }
    }
  },
  index: 0
};

export default (state = defaultState, action) => {
  let flow, index;

  switch(action.type) {
    case 'ADD_FLOW':
      index = state.index;
      const newFlow = Object.assign({}, action.flow, {
        flowId: index
      });
      index += 1;
      return Object.assign({}, state, {
        activeFlowIds: [...state.activeFlowIds, newFlow.flowId],
        activeFlowMap: Object.assign({}, state.activeFlowMap, {
          [newFlow.flowId]: newFlow
        }),
        index
      });

    case 'ADD_BULK_FLOWS':
      index = state.index;
      const newFlowGroup = {
        flowIds: [],
        flowId: index,
        name: action.flowGroup.name,
        group: true
      };
      index += 1;
      
      const newFlows = {};
      action.flowGroup.flows.forEach((flow) => {
        const newFlow = Object.assign({}, flow, {
          flowId: index,
          parentId: newFlowGroup.flowId
        });
        newFlowGroup.flowIds.push(index);
        newFlows[index] = newFlow;
        index += 1;
      });
      return Object.assign({}, state, {
        activeFlowIds: [...state.activeFlowIds, newFlowGroup.flowId],
        activeFlowMap: Object.assign({}, state.activeFlowMap, newFlows, {
          [newFlowGroup.flowId]: newFlowGroup
        }),
        index
      });

    case 'EDIT_FLOW':
      flow = state.activeFlowMap[action.flowId];
      return Object.assign({}, state, {
        activeFlowMap: Object.assign({}, state.activeFlowMap, {
          [action.flowId]: Object.assign({}, flow, {
            inputs: Object.assign({}, flow.inputs, action.inputChanges),
            flowFcns: action.flowFcns,
            flowStrs: action.flowStrs
          })
        })
      });

    case 'EDIT_FLOW_FORM':
      flow = state.flowForms[action.flowType];
      return Object.assign({}, state, {
        flowForms: Object.assign({}, state.flowForms, {
          [action.flowType]: Object.assign({}, flow, {
            inputs: Object.assign({}, flow.inputs, action.inputChanges)
          })
        })
      });

    case 'REMOVE_FLOW':
      const flowToRemove = state.activeFlowMap[action.flowId];
      const { parentId } = flowToRemove;
      if(parentId !== undefined) {
        const parentFlow = state.activeFlowMap[parentId];
        return Object.assign({}, state, {
          activeFlowMap: Object.assign({}, state.activeFlowMap, {
            [parentId]: Object.assign({}, parentFlow, {
              flowIds: parentFlow.flowIds.filter(id => id !== action.flowId)
            })
          })
        });
      } else {
        return Object.assign({}, state, {
          activeFlowIds: state.activeFlowIds.filter(id => id !== action.flowId),
          activeFlowMap: Object.assign({}, state.activeFlowMap, {
            [action.flowId]: undefined
          })
        });
      }

    case 'EDIT_FLOW_VIEW':
      return Object.assign({}, state, {
        flowView: action.view
      });

    default:
      return state;
  }
};