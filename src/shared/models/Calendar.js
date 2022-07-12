class Calendar{
  constructor(props) {
    const {
      id = '',
      start_date = '',
      end_date = '',
      subject = '',
      location = '',
      shared_calander_events_attributes = {},
      _destroy = false
    } = props || {};
    this.id = id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.subject = subject;
    this.location = location;
    this._destroy = _destroy;
    this.shared_calander_events_attributes = new SharedCalanderEvents(shared_calander_events_attributes);
  }
}

class SharedCalanderEvents{
  constructor(props) {
    const {
      id = '',
      shared_with_id = '',
      calander_id = '',
      _destroy = false
    } = props || {};
    this.id = id;
    this.shared_with_id = shared_with_id;
    this.calander_id = calander_id;
    this._destroy = _destroy;
  }
}


export { Calendar, SharedCalanderEvents };