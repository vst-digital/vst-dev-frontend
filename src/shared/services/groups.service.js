const url = '/groups';
const getGroups = (params) => ({ url, method: 'get', params });

const getGroup = (id) => ({
  url: `${url}/${id}`, method: 'get',
  params: {}
});

const postGroup = (payload) => ({ url, method: 'post', data: payload });
const postGroupMemberAdd = (id, payload) => 
({ 
  url: `${url}/${id}/members_add`, method: 'post', data: payload 
});

const postGroupMemberRemove = (id, payload) => 
({ 
  url: `${url}/${id}/members_remove`, method: 'post', data: payload 
});


const putGroup = (id, payload) => ({ url: `${url}/${id}`, method: 'put', data: payload });

const deleteGroup = (id) => ({ url: `${url}/${id}`, method: 'DELETE' });


export { getGroups, getGroup, postGroup, putGroup, deleteGroup, postGroupMemberAdd, postGroupMemberRemove };
