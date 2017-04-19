export default (state = { alerts: [] }, action) => {
  switch(action.type) {
    case 'ADD_ALERT':
      const alerts = action.alert.undo ?
        state.alerts.filter(alert => !alert.undo) :
        [...state.alerts];
      return Object.assign({}, state, {
        alerts: [...alerts, action.alert],
        index: state.index + 1
      });

    case 'REMOVE_ALERT':
      return Object.assign({}, state, {
        alerts: state.alerts.filter(alert => alert.id !== action.id)
      });

    default:
      return state;
  }
};