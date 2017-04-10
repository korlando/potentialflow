import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';

const defaultState = {
  activeFlowIds: [],
  activeFlowMap: {},
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
        x0: 50,
        y0: 50
      }
    },
    [POINT_VORTEX]: {
      inputs: {
        gamma: 100,
        x0: 50,
        y0: 50
      }
    },
    [DIPOLE]: {
      inputs: {
        mu: 100,
        x0: 50,
        y0: 50,
        alpha: 0
      }
    }
  },
  index: 0
};

export default (state = defaultState, action) => {
  let flow;

  switch(action.type) {
    case 'ADD_FLOW':
      const newFlow = Object.assign({}, action.flow, {
        flowId: state.index
      });
      return Object.assign({}, state, {
        activeFlowIds: [...state.activeFlowIds, newFlow.flowId],
        activeFlowMap: Object.assign({}, state.activeFlowMap, {
          [newFlow.flowId]: newFlow
        }),
        index: state.index + 1
      });

    case 'EDIT_FLOW':
      flow = state.activeFlowMap[action.flowId];
      return Object.assign({}, state, {
        activeFlowMap: Object.assign({}, state.activeFlowMap, {
          [action.flowId]: Object.assign({}, flow, {
            inputs: Object.assign({}, flow.inputs, action.inputChanges)
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
      return Object.assign({}, state, {
        activeFlowIds: state.activeFlowIds.filter(id => id !== action.flowId),
        activeFlowMap: Object.assign({}, state.activeFlowMap, {
          [action.flowId]: undefined
        })
      });

    default:
      return state;
  }
};