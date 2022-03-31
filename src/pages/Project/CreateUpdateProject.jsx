import { useEffect, useState } from "react";
import get from "lodash/get";
import { Field, useFormik } from "formik";
import {
  Button,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography
} from "@material-ui/core";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import DeleteIcon from "@material-ui/icons/Delete";
import DownwardIcon from "@material-ui/icons/ArrowDownward";
import UpwardIcon from "@material-ui/icons/ArrowUpward";

import { useHttp } from "hooks";
import { AsyncSelect, Container, Panel, TextField } from "components";
import { Project } from "shared/models";
import { FIELD_SIZE, HOURS, KM, LATLNG } from "shared/utilities/constant";
import { Project_Validation } from "shared/utilities/validationSchema.util";
import { getProject, getProjects, postProject, putProject, deleteProject } from "shared/services";
import { Autocomplete } from "@material-ui/lab";
import {PROJECT_STATUS} from "shared/utilities/referenceData.util";

const useStyles = makeStyles((theme) => ({
  action: { marginRight: theme.spacing(1) },
  rowActions: {
    '& > :first-child :hover': { color: theme.palette.error.dark },
    '& > :not(:first-child) :hover': { color: theme.palette.primary.dark },
    '& > :not(:last-child)': { marginRight: theme.spacing(.5) }
  },
  noDataFound: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const CreateUpdateProject = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const action = location.state?.data?.action || 'Add';
  const project = new Project(location.state?.data?.project);

  const onConfirm = async () => {
    const payload = { project: values };
    try {
      const requestConfig = (action === 'Add') ? postProject(payload) : putProject(values.id, payload);
      await requestHandler(requestConfig, { loader: true });
      notify({ msg: 'Project has been saved successfully!!', type: 'success' });
      history.push('/projects');
    } catch (e) {
      notify({ msg: 'Not able to save organization. Something went wrong!!', type: 'error' });
    }
  };

  const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
    initialValues: project,
    validationSchema: Project_Validation,
    onSubmit: onConfirm
  });

  return (
    <form onSubmit={handleSubmit}>
      <Container title={`${action} Project`} actions={
        <>
          <Button type="submit" color="primary" variant="contained">Save</Button>
          <Button variant="contained" onClick={() => history.push('/projects')}>Cancel</Button>
        </>
      }>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Panel title="Project Details">
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography gutterBottom>Project Title</Typography>
                  <TextField
                    id="title"
                    value={values.title} onChange={handleChange}
                    error={touched.title}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Status</Typography>
                  <TextField
                    id="status"
                    value={values.status} onChange={handleChange}
                    error={touched.status && Boolean(errors.status)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Description</Typography>
                  <TextareaAutosize
                    id="project_description"
                    minRows={3}
                    style={{ width: 600 }}
                    value={values.project_description} onChange={handleChange}
                    error={touched.project_description && Boolean(errors.project_description)}
                    helperText={touched.project_description && errors.project_description}
                  />
                </Grid>
              </Grid>
            </Panel>
          </Grid>
        </Grid>
      </Container>
    </form>
  )
}

export default CreateUpdateProject;