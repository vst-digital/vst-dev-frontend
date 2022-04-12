const url = '/user_memo_templates';
const getMemoTemplates = (params) => ({url, method: 'get', params});
const getMemoTemplate = (id) => ({url: `${url}/${id}`, method: 'get'});

const postMemoTemplate = (payload) => ({url, method: 'post', data: payload});
const deleteMemoTemplate = (payload) => ({url, method: 'delete', data: payload});

export { getMemoTemplates, getMemoTemplate, postMemoTemplate, deleteMemoTemplate };
