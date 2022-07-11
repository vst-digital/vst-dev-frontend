const url = '/calanders';
const getCalanderEvent = (params) => ({ url, method: 'get', params });
const postCalanderEvent = (payload) => ({ url, method: 'post', data: payload });
const putCalanderEvent = (payload) => ({ url, method: 'put', data: payload });
const deleteCalanderEvent = (payload) => ({ url, method: 'delete', data: payload });

export { getCalanderEvent, postCalanderEvent, putCalanderEvent, deleteCalanderEvent };
