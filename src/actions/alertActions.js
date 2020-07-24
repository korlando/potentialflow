export const addAlert = alert => ({
  type: 'ADD_ALERT',
  alert,
});

export const removeAlert = id => ({
	type: 'REMOVE_ALERT',
	id,
});
