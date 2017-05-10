import { UNIFORM,
         POINT_SOURCE,
         POINT_VORTEX,
         DIPOLE} from '../constants/flowTypes';

const defaultState = {
  activeFlowIds: [],
  activeFlowMap: {},
  history: [{
    activeFlowIds: [],
    activeFlowMap: {}
  }],
  historyIndex: 0,
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

const flowTypeToName = {
  [UNIFORM]: 'Uniform Flow',
  [POINT_VORTEX]: 'Point Vortex Flow',
  [DIPOLE]: 'Dipole Flow'
};

const getHistoryName = (flow, prefix) => {
  if(flow.group) {
    return prefix + flow.name;
  }
  switch(flow.type) {
    case UNIFORM:
      return prefix + 'Uniform Flow';
    case POINT_SOURCE:
      if(flow.m >= 0) {
        return prefix + 'Point Souce Flow';
      }
      return prefix + 'Point Sink Flow';
    case POINT_VORTEX:
      return prefix + 'Point Vortex Flow';
    case DIPOLE:
      return prefix + 'Dipole';
    default:
      return prefix;
  }
};

export default (state = defaultState, action) => {
  let flow, index, history, historyEntry, historyIndex;

  switch(action.type) {
    case 'BOOTSTRAP_FLOWS':
      return Object.assign({}, state, {
        activeFlowIds: action.flowIds,
        activeFlowMap: action.flowMap,
        index: action.maxIndex + 1,
        history: [{
          activeFlowIds: action.flowIds,
          activeFlowMap: action.flowMap,
        }],
      });
    case 'ADD_FLOW':
      index = state.index;
      const newFlow = Object.assign({}, action.flow, {
        flowId: index
      });
      index += 1;
      historyEntry = {
        activeFlowIds: [...state.activeFlowIds, newFlow.flowId],
        activeFlowMap: Object.assign({}, state.activeFlowMap, {
          [newFlow.flowId]: newFlow
        }),
        name: getHistoryName(newFlow, 'add ')
      };
      historyIndex = state.historyIndex + 1;
      history = [...state.history.slice(0, historyIndex), historyEntry];
      return Object.assign({}, state, historyEntry, {
        index,
        historyIndex,
        history
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
      historyEntry = {
        activeFlowIds: [...state.activeFlowIds, newFlowGroup.flowId],
        activeFlowMap: Object.assign({}, state.activeFlowMap, newFlows, {
          [newFlowGroup.flowId]: newFlowGroup
        }),
        name: getHistoryName(newFlowGroup, 'add ')
      };
      historyIndex = state.historyIndex + 1;
      history = [...state.history.slice(0, historyIndex), historyEntry];
      return Object.assign({}, state, historyEntry, {
        index,
        historyIndex,
        history
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
      const historyName = getHistoryName(flowToRemove, 'remove ');
      if(parentId !== undefined) {
        const parentFlow = state.activeFlowMap[parentId];
        historyEntry = {
          activeFlowIds: state.activeFlowIds,
          activeFlowMap: Object.assign({}, state.activeFlowMap, {
            [parentId]: Object.assign({}, parentFlow, {
              flowIds: parentFlow.flowIds.filter(id => id !== action.flowId)
            }),
          }),
          name: historyName
        };
      } else {
        historyEntry = {
          activeFlowIds: state.activeFlowIds.filter(id => id !== action.flowId),
          activeFlowMap: Object.assign({}, state.activeFlowMap, {
            [action.flowId]: undefined
          }),
          name: historyName
        };
      }
      historyIndex = state.historyIndex + 1;
      history = [...state.history.slice(0, historyIndex), historyEntry];
      return Object.assign({}, state, historyEntry, {
        historyIndex,
        history
      });

    case 'REMOVE_ALL_FLOWS':
      historyEntry = {
        activeFlowIds: [],
        activeFlowMap: {},
        name: 'remove all flows',
      };
      historyIndex = state.historyIndex + 1;
      history = [...state.history.slice(0, historyIndex), historyEntry];
      return Object.assign({}, state, historyEntry, {
        historyIndex,
        history
      });

    case 'EDIT_FLOW_VIEW':
      return Object.assign({}, state, {
        flowView: action.view
      });

    case 'UNDO_FLOW_HISTORY':
      historyIndex = state.historyIndex - 1;
      if(historyIndex >= 0) {
        historyEntry = state.history[historyIndex];
        return Object.assign({}, state, historyEntry, {
          historyIndex
        });
      }
      return state;

    case 'REDO_FLOW_HISTORY':
      historyIndex = state.historyIndex + 1;
      if(historyIndex < state.history.length) {
        historyEntry = state.history[historyIndex];
        return Object.assign({}, state, historyEntry, {
          historyIndex
        });
      }
      return state;

    default:
      return state;
  }
};