const url = '/organizations';
const getOrganizations = (params) => ({url, method: 'get', params});

const getOrganization = (id) => ({
    url: `${url}/${id}`, method: 'get',
    params: {}
});

const postOrganization = (payload) => ({url, method: 'post', data: payload});

const putOrganization = (id, payload) => ({url: `${url}/${id}`, method: 'put', data: payload});

const deleteOrganization = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getOrganizations, getOrganization, postOrganization, putOrganization, deleteOrganization};
