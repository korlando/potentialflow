import { combineReducers } from 'redux';
import flow from './flowReducers';
import alert from './alertReducers';

export default combineReducers({
  flow, alert
});