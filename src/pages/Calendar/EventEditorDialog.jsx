import React, { useState } from "react";
import { useFormik } from "formik";
import { Box, styled } from "@mui/system";
import {
  Dialog,
  IconButton,
  Button,
  Icon,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DateTimePicker } from "@material-ui/pickers";
import { AsyncSelect } from "components";

import { Calendar_Validation } from "shared/utilities/validationSchema.util";
import { Calendar, SharedCalanderEvents } from "shared/models";
import { useHttp } from "hooks";
import { getSelectDataSource } from "shared/utilities/common.util";
import { getCalanderEvent, postCalanderEvent, putCalanderEvent, deleteCalanderEvent, getAllMembersList } from "shared/services";

const DialogFooter = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const DialogHeader = styled(DialogFooter)(() => ({
  padding: "10px 15px",
}));

const EventEditorDialog = ({ event = {}, open, handleClose, history }) => {
  const [calendarEvent, setCalendarEvent] = useState(event);
  const { notify, requestHandler } = useHttp();
  const [toggle, setToggle] = useState();

  const onReceiverChange = (receiver_instance) => {
    const receiver_id = receiver_instance.map((e) => ({
      ...e?.id,
    }));
    if (receiver_instance) {
      // console.log(receiver_instance);
      console.log(receiver_id);
    } else {
    }
  };

  const getReceiverList = () =>
    new Promise((resolve, reject) => {
      const params = { per_page: 500, page_no: 1, sort: "created_at.desc" };
      getSelectDataSource(requestHandler, getAllMembersList(params))
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });

  const handleMemberChange = (event) => {
    debugger
    let calander = new Calendar(values);
    // calander.receiver_id.push(event);
    calander.shared_calander_events_attributes = {"shared_with_id": event.map(x => x.id)};
    setCalendarEvent(calander);
  };

  const handleToggle = () => {
    if (toggle === "false") {
      setToggle("true");
    } else {
      setToggle("false");
    }
  };

  const onConfirm = async () => {
    const payload = { calander: values };
    try {
      const requestConfig = postCalanderEvent(payload);
      await requestHandler(requestConfig, { loader: true });
      notify({ msg: 'Calander has been saved successfully!!', type: 'success' });
      history.push('/calendar');
    } catch (e) {
      debugger
      notify({ msg: 'Not able to save calendar. Something went wrong!!', type: 'error' });
    }
  };

  const handleStartDateChange = (selected_date) => {
    debugger
    let calander = new Calendar(values);
    calander.start_date = selected_date
    setValues(calander)
  }

  const handleEndDateChange = (selected_date) => {
    let calander = new Calendar(values);
    calander.end_date = selected_date
    setValues(calander)
  }

  // let { location, subject, start, end } = calendarEvent;

  const { values, touched, errors, handleChange, setValues } = useFormik({
    initialValues: Calendar,
    validationSchema: Calendar_Validation,
    onSubmit: onConfirm,
  });
  return (
    <form onSubmit={onConfirm}>
      <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
        <DialogHeader>
          <h1> New Event</h1>
          <IconButton onClick={handleClose}>
            <Icon sx={{ color: "#fff" }}>clear</Icon>
          </IconButton>
        </DialogHeader>

        <Box p={2}>
          <Box py={1.3} />
          <TextField
            label="Subject"
            id="subject"
            onChange={handleChange}
            type="text"
            name="subject"
            value={values.subject || ""}
            multiline={true}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />
          <TextField
            label="Location"
            id="location"
            onChange={handleChange}
            type="text"
            name="location"
            value={values.location || ""}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />
          <Grid container spacing={4}>
            <Grid item sm={6} xs={12}>
              <DateTimePicker
                id="start_date"
                name="start_date"
                onChange={handleStartDateChange}
                value={values.start_date}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <DateTimePicker
                id="end_date"
                name="end_date"
                onChange={handleEndDateChange}
                value={values.end_date}
              />
            </Grid>
          </Grid>

          {toggle === "false" && (
            <Grid item xs={6}>
              <AsyncSelect
                id={"receiver_id"}
                name="receiver_id"
                label="Members"
                getOptionLabel={(getMemberLabel) => getMemberLabel?.email || ""}
                loadingMethod={getReceiverList}
                value={values.receiver_id}
                onChange={handleMemberChange}
                error={touched.receiver_id && Boolean(errors.receiver_id)}
                helperText={touched.receiver_id && errors.receiver_id}
                multiple
                style={{
                  width: "100%",
                  marginBottom: "4px",
                  marginTop: "24px",
                }}
              />
            </Grid>
          )}
          <FormControlLabel
            control={<Switch onChange={handleToggle} />}
            label="Invite Members"
          />
          <DialogFooter>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              Save
            </Button>
            {/* <Button onClick={handleDeleteEvent}>
              <Icon sx={{ mr: 1, verticalAlign: "middle" }}>delete</Icon>
              Delete
            </Button> */}
          </DialogFooter>
        </Box>
      </Dialog>
    </form>
  );
};

export default EventEditorDialog;
