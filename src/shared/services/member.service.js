const url = '/members';
const getMembers = (params) => ({url, method: 'get', params});

const postMemberInvite = (payload) => ({url, method: 'post', data: payload});

export { getMembers, postMemberInvite };
