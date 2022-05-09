const url = '/project_user_memo_replies';
const getMemoReplies = (params) => ({ url, method: 'get', params });
const postMemoReply = (payload) => ({ url, method: 'post', data: payload });

export { getMemoReplies, postMemoReply };
