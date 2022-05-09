import { Group } from "./Group";

class Project{
  constructor(props) {
    const {
      id = '',
      title = '',
      status = '',
      project_description = '',
      groups = [],
      // _destroy = false
    } = props || {};
    this.id = id;
    this.title = title;
    this.status = status;
    this.project_description = project_description;
    this.groups = groups.map(groups => new Group(groups));
  }
}
export {Project};