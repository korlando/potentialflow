export const addAlert = (alert) => {
  return {
    type: 'ADD_ALERT',
    alert
  };
};

export const removeAlert = (id) => {
  return {
    type: 'REMOVE_ALERT',
    id
  };
};