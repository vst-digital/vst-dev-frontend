class StorageFolder{
  constructor(props) {
    const {
      id = '',
      user_storage_id = '',
      project_id = '',
      name = '',
      isDirectory = '',
      size = '',
      parent_id = '',
      created_at = '',
      updated_at = '',
      __KEY__ = '',
      _destroy = false
    } = props || {};
    this.id = id;
    this.user_storage_id = user_storage_id
    this.project_id = project_id
    this.name = name
    this.isDirectory = isDirectory
    this.size = size
    this.__KEY__ = __KEY__
    this.parent_id = parent_id
    this.created_at = created_at
    this.updated_at = updated_at
  }
}
export {StorageFolder};


