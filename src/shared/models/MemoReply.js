class MemoReply{
  constructor(props) {
    const {
      id = '',
      content = '',
      project_user_memo_id = '',
      created_at ='',
      _destroy = false
    } = props || {};
    this.id = id;
    this.content = content;
    this.project_user_memo_id = project_user_memo_id;
    this.created_at = created_at;
  }
}
export {MemoReply};