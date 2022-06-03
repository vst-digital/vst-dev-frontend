import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Grid,
} from "@material-ui/core";
import { TextField, AsyncSelect } from "components";
import { useFormik } from "formik";
import { Project_Validation } from "shared/utilities/validationSchema.util";
import { Project } from "shared/models";
import { getProjects } from "shared/services";
import { useHttp } from "hooks";
import { useState } from "react";
import {
  errorMessage,
  getProjectLabel,
  getFullName,
  getNumberRoundToOneDecimal,
  getOptionLabel,
  getSelectDataSource,
  hasError,
} from "shared/utilities/common.util";

const SelectProject = ({ onOpen, onClose, history, location }) => {
  const [open, setOpen] = React.useState(true);
  const project = new Project();
  const { notify, requestHandler } = useHttp();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (values?.id) {
      setOpen(false);
    } else {
      //   <Alert severity="error">You must select a project to proceed!</Alert>;
      alert("You must select a project to proceed!");
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

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setFieldError,
  } = useFormik({
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
      <Dialog open={open} onClose={handleClose}>
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
