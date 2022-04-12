class Memo{
  constructor(props) {
    const {
      id = '',
      subject = '',
      to = '',
      template = '',
      _destroy = false
    } = props || {};
    this.id = id;
    this.subject = subject;
    this.to = to;
    this.template = template;
  }
}
export {Memo};