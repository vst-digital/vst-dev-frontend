const url = '/project_user_memos';
const getSentMemos = (params) => ({url: `${url}/get_sent_memo`, method: 'get', params});
const getRecievedMemos = (params) => ({url: `${url}/get_recieved_memo`, method: 'get', params});

const getMemo = (id) => ({url: `${url}/${id}`, method: 'get'});

const postMemo = (payload) => ({url, method: 'post', data: payload});
const deleteMemo = (payload) => ({url, method: 'delete', data: payload});

export { getSentMemos, getMemo, postMemo, deleteMemo, getRecievedMemos };
