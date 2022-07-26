import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import { AsyncSelect } from "components";
import { useFormik } from "formik";
import { useHttp } from "hooks";
import * as React from "react";
import { Project } from "shared/models";
import { getProjects } from "shared/services";
import {
  getProjectLabel,
  getSelectDataSource,
} from "shared/utilities/common.util";
import { Project_Validation } from "shared/utilities/validationSchema.util";

const SelectProject = ({ history }) => {
  const [open, setOpen] = React.useState(true);
  const project = new Project();
  const { notify, requestHandler } = useHttp();

  const handleClose = () => {
    if (values?.id) {
      setOpen(false);
    } else {
      notify({
        originVertical: "top",
        originHorizontal: "center",
        msg: "You must select a project to proceed!",
        type: "error",
      });
    }
  };

  const onConfirm = async () => {
    try {
      localStorage.setItem("project_id", values.id);
      localStorage.setItem("project_title", values.title);
      localStorage.setItem("project_status", values.status);
      localStorage.setItem("project_description", values.project_description);
      history.push("/home");
    } catch (e) {
      notify({
        msg: "Not able to send Invite. Something went wrong!!",
        type: "error",
      });
    }
  };

  const onProjectChange = (project_instance) => {
    const project = new Project(project_instance);
    setValues(project);
  };

  const { values, handleSubmit, setValues } = useFormik({
    initialValues: project,
    validationSchema: Project_Validation,
    onSubmit: onConfirm,
  });

  const getProjectsList = () =>
    new Promise((resolve, reject) => {
      const params = { per_page: 500, page_no: 1, sort: "created_at.desc" };
      getSelectDataSource(requestHandler, getProjects(params))
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });

  return (
    <form onSubmit={handleSubmit}>
      <Dialog id="project-select" open={open} onClose={handleClose}>
        <DialogTitle>Select Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name to search.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AsyncSelect
                id={"project"}
                getOptionLabel={getProjectLabel}
                loadingMethod={getProjectsList}
                value={values}
                onChange={onProjectChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" color="primary" onClick={onConfirm}>
            Select Project
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default SelectProject;
