import { Member } from "./Member"
class Group{
  constructor(props) {
    const {
      id = '',
      name = '',
      description = '',
      created_at = '',
      users = [],
      _destroy = false
    } = props || {};
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
    this.users = users.map(users => new Member(users));
  }
}
export {Group};