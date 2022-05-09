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
    this.phone = phone;
    this.address = address;
    this.description = description;
  }
}
export {Organization};