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
} from "@mui/material";
import { DateTimePicker } from "@material-ui/pickers";
import { AsyncSelect } from "components";
import {
  addNewEvent,
  updateEvent,
  deleteEvent,
} from "../../shared/services/calendar.service";
import { Calendar_Validation } from "shared/utilities/validationSchema.util";
import { Calendar } from "shared/models";
import { useHttp } from "hooks";
import { getSelectDataSource } from "shared/utilities/common.util";
import { getAllMembersList } from "shared/services";

const DialogFooter = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const DialogHeader = styled(DialogFooter)(() => ({
  padding: "10px 15px",
}));

const EventEditorDialog = ({ event = {}, open, handleClose }) => {
  const [calendarEvent, setCalendarEvent] = useState(event);
  const { notify, requestHandler } = useHttp();

  const onReceiverChange = (receiver_instance) => {
    if (receiver_instance) {
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
  const handleChange = (event) => {
    setCalendarEvent({
      ...calendarEvent,
      [event?.target?.name]: event?.target?.value,
    });
  };

  const handleFormSubmit = () => {
    let { id } = calendarEvent;
    if (id) {
      updateEvent({
        ...calendarEvent,
      }).then(() => {
        handleClose();
      });
    } else {
      addNewEvent({
        id: generateRandomId(),
        ...calendarEvent,
      }).then(() => {
        handleClose();
      });
    }
  };

  const handleDeleteEvent = () => {
    if (calendarEvent?.id) {
      deleteEvent(calendarEvent).then(() => {
        handleClose();
      });
    }
  };
  const handleDateChange = (date, name) => {
    setCalendarEvent({
      ...calendarEvent,
      [name]: date,
    });
  };
  const generateRandomId = () => {
    let tempId = Math.random().toString();
    let id = tempId?.substr(2, tempId.length - 1);
    return id;
  };
  let { title, location, subject } = calendarEvent;

  const { values, touched, errors, handleSubmit } = useFormik({
    initialValues: Calendar,
    validationSchema: Calendar_Validation,
    onSubmit: handleFormSubmit,
  });
  return (
    <form onSubmit={handleSubmit}>
      <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
        <DialogHeader>
          <h1> Add Event</h1>
          <IconButton onClick={handleClose}>
            <Icon sx={{ color: "#fff" }}>clear</Icon>
          </IconButton>
        </DialogHeader>

        <Box p={2}>
          <TextField
            label="Title"
            type="text"
            name="title"
            value={title || ""}
            onChange={handleChange}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />
          <Grid container spacing={4}>
            <Grid item sm={6} xs={12}>
              <DateTimePicker
                onChange={(date) => handleDateChange(date, "start")}
                renderInput={(props) => (
                  <TextField {...props} label="Start date" variant="standard" />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <DateTimePicker
                onChange={(date) => handleDateChange(date, "end")}
                renderInput={(props) => (
                  <TextField {...props} label="End date" variant="standard" />
                )}
              />
            </Grid>
          </Grid>
          <Box py={1.3} />
          <TextField
            label="Location"
            onChange={handleChange}
            type="text"
            name="location"
            value={location || ""}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />

          <TextField
            label="Subject"
            onChange={handleChange}
            type="text"
            name="subject"
            value={subject || ""}
            multiline={true}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />
          <AsyncSelect
            id={"receiver_id"}
            label="Members"
            getOptionLabel={(getMemberLabel) => getMemberLabel?.email || ""}
            loadingMethod={getReceiverList}
            value={values.receiver_id}
            onChange={onReceiverChange}
            error={touched.receiver_id && Boolean(errors.receiver_id)}
            helperText={touched.receiver_id && errors.receiver_id}
            multiple
            style={{ width: "100%", marginBottom: "24px" }}
          />
          <DialogFooter>
            <Button variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={handleDeleteEvent}>
              <Icon sx={{ mr: 1, verticalAlign: "middle" }}>delete</Icon>
              Delete
            </Button>
          </DialogFooter>
        </Box>
      </Dialog>
    </form>
  );
};

export default EventEditorDialog;
