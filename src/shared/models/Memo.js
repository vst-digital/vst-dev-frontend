class Memo{
  constructor(props) {
    const {
      id = '',
      subject = '',
      receiver_id = [],
      cc = [],
      bcc = [],
      receiver = '',
      sender_id = '',
      sender = '',
      body = '',
      answers = '',
      project_user_memo_replies = '', 
      created_at ='',
      _destroy = false
    } = props || {};
    this.id = id;
    this.subject = subject;
    this.receiver_id = receiver_id;
    this.receiver = receiver;
    this.sender_id = sender_id;
    this.sender = sender;
    this.body = body;
    this.cc = cc;
    this.bcc = bcc;
    this.answers = answers;
    this.project_user_memo_replies = project_user_memo_replies;
    this.created_at = created_at;
  }
}
export {Memo};