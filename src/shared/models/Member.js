class Member{
    constructor(props) {
      const {
        id = '',
        name = '',
        role = '',
        email = '',
        invitation_status = false,
        created_at = '',
        _destroy = false
      } = props || {};
      this.id = id;
      this.name = name;
      this.role = role;
      this.email = email;
      this.invitation_status = invitation_status;
      this.created_at = created_at;
    }
  }
  export {Member};