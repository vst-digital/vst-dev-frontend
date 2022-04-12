class Member{
    constructor(props) {
      const {
        id = '',
        first_name = '',
        last_name = '',
        role = '',
        email = '',
        contact = '',
        invitation_status = false,
        created_at = '',
        _destroy = false
      } = props || {};
      this.id = id;
      this.first_name = first_name;
      this.last_name = last_name;
      this.contact = contact;
      this.role = role;
      this.email = email;
      this.invitation_status = invitation_status;
      this.created_at = created_at;
    }
  }
  export {Member};