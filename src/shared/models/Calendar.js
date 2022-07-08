class Calendar {
  constructor(props) {
    const {
      start_date = '',
      end_date = '',
      subject = '',
      location = '',
      receiver_id = [],
      _destroy = false
    } = props || {};
    this.subject = subject;
    this.start_date = start_date;
    this.end_date = end_date;
    this.locate = location;
    this.receiver_id = receiver_id;
  }
}
export { Calendar };