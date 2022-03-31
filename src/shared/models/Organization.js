class Organization{
  constructor(props) {
    const {
      id = '',
      name = '',
      phone = '',
      address = '',
      description = '',
      _destroy = false
    } = props || {};
    this.id = id;
    this.name = name;
    this.phone = name;
    this.address = name;
    this.description = description;
  }
}
export {Organization};