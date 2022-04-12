const url = '/project_user_memos';
const getMemos = (params) => ({url, method: 'get', params});
const getMemo = (id) => ({url: `${url}/${id}`, method: 'get'});

const postMemo = (payload) => ({url, method: 'post', data: payload});
const deleteMemo = (payload) => ({url, method: 'delete', data: payload});

export { getMemos, getMemo, postMemo, deleteMemo };
