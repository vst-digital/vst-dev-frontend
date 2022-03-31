import { useEffect, useState } from "react";
import get from "lodash/get";
import { useFormik } from "formik";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
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
import { Group } from "shared/models";
import { FIELD_SIZE, HOURS, KM, LATLNG } from "shared/utilities/constant";
import { Group_Validation } from "shared/utilities/validationSchema.util";
import { postGroup, putGroup } from "shared/services";

const useStyles = makeStyles((theme) => ({
  action: {marginRight: theme.spacing(1)},
  rowActions: {
      '& > :first-child :hover': {color: theme.palette.error.dark},
      '& > :not(:first-child) :hover': {color: theme.palette.primary.dark},
      '& > :not(:last-child)': {marginRight: theme.spacing(.5)}
  },
  noDataFound: {
      display: 'flex',
      justifyContent: 'center'
  }
}));

const CreateUpdateGroup = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const action = location.state?.data?.action || 'Add';
  const group = new Group(location.state?.data?.group);

  const onConfirm = async () => {
    const payload = { group: values };
    try {
      const requestConfig = (action === 'Add') ? postGroup(payload) : putGroup(values.id, payload);
      await requestHandler(requestConfig, { loader: true });
      notify({ msg: 'Group has been saved successfully!!', type: 'success' });
      history.push('/groups');
    } catch (e) {
      notify({ msg: 'Not able to save group. Something went wrong!!', type: 'error' });
    }
  };

  const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
    initialValues: group,
    validationSchema: Group_Validation,
    onSubmit: onConfirm
  });

  return (
    <form onSubmit={handleSubmit}>
      <Container title={`${action} Contacts`} actions={
        <>
          <Button type="submit" color="primary" variant="contained">Save</Button>
          <Button variant="contained" onClick={() => history.push('/group')}>Cancel</Button>
        </>
      }>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Panel title="Groups">
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography gutterBottom>Group Name</Typography>
                  <TextField
                    id="name"
                    value={values.name} onChange={handleChange}
                    error={touched.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Group Description</Typography>
                  <TextField
                    id="description"
                    value={values.description} onChange={handleChange}
                    error={touched.description}
                    helperText={touched.name && errors.description}
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

export default CreateUpdateGroup;