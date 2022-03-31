const url = '/locations';

const getCurrentLocation = (params) => ({url, method: 'get', params});

export {getCurrentLocation};