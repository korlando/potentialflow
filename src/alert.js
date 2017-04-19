import * as alertActions from './actions/alertActions';
import store from './store/store';

const timers =  {};
let index = 0;

export const addAlert = (text, undo, timeout) => {
  const id = index;
  store.dispatch(alertActions.addAlert({
    text, undo, id
  }));
  
  if(timeout) {
    timers[id] = setTimeout(() => {
      removeAlert(id);
    }, timeout);
  }
  index += 1;
};

export const removeAlert = (id) => {
  clearTimeout(timers[id]);
  store.dispatch(alertActions.removeAlert(id));
};