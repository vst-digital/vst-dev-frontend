class MemoTemplate{
  constructor(props) {
    const {
      id = '',
      name = '',
      number = '',
      template = '',
      _destroy = false
    } = props || {};
    this.id = id;
    this.name = name;
    this.number = number;
    this.template = template;
  }
}
export {MemoTemplate};