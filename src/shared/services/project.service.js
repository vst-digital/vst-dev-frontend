const url = '/projects';
const getProjects = (params) => ({url, method: 'get', params});

const getProject = (id) => ({
    url: `${url}/${id}`, method: 'get',
    params: {}
});

const postProject = (payload) => ({url, method: 'post', data: payload});

const putProject = (id, payload) => ({url: `${url}/${id}`, method: 'put', data: payload});
const postProjectGroupAssign = (id, payload) => ({url: `${url}/${id}/assign_group`, method: 'post', data: payload});

const deleteProject = (id) => ({url: `${url}/${id}`, method: 'delete'});

export {getProject, getProjects, postProject, putProject, deleteProject, postProjectGroupAssign};
