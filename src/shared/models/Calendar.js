class Calendar{
  constructor(props) {
    const {
      title = '',
      start_date = '',
      end_date = '',
      subject = '',
      location = '',
      receiver_id = [],
      _destroy = false
    } = props || {};
    this.title = title;
    this.subject = subject;
    this.start_date = start_date;
    this.end_date = end_date;
    this.location = location;
    this.receiver_id = receiver_id;
  }
}
export {Calendar};