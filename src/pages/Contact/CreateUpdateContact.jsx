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
import { Organization } from "shared/models";
import { FIELD_SIZE, HOURS, KM, LATLNG } from "shared/utilities/constant";
import { Organization_Validation } from "shared/utilities/validationSchema.util";
import { getOrganizations, getOrganization, postOrganization, putOrganization, deleteOrganization } from "shared/services";

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

const CreateUpdateOrganization = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const action = location.state?.data?.action || 'Add';
  const organization = new Organization(location.state?.data?.organization);

  const onConfirm = async () => {
    const payload = { organization: values };
    try {
      const requestConfig = (action === 'Add') ? postOrganization(payload) : putOrganization(values.id, payload);
      await requestHandler(requestConfig, { loader: true });
      notify({ msg: 'Organization has been saved successfully!!', type: 'success' });
      history.push('/organization');
    } catch (e) {
      notify({ msg: 'Not able to save organization. Something went wrong!!', type: 'error' });
    }
  };

  const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
    initialValues: organization,
    validationSchema: Organization_Validation,
    onSubmit: onConfirm
  });

  return (
    <form onSubmit={handleSubmit}>
      <Container title={`${action} Contacts`} actions={
        <>
          <Button type="submit" color="primary" variant="contained">Save</Button>
          <Button variant="contained" onClick={() => history.push('/organization')}>Cancel</Button>
        </>
      }>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Panel title="Contacts">
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography gutterBottom>Organization Name</Typography>
                  <TextField
                    id="name"
                    value={values.name} onChange={handleChange}
                    error={touched.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Phone</Typography>
                  <TextField
                    id="phone"
                    value={values.phone} onChange={handleChange}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Address</Typography>
                  <TextField
                    id="address"
                    value={values.address} onChange={handleChange}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>description</Typography>
                  <TextareaAutosize
                    id="description"
                    minRows={3}
                    style={{ width: 600 }}
                    value={values.description} onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
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

export default CreateUpdateOrganization;