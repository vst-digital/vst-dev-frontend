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
import axios from "axios";

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
  const handleChange = (event) => {
    setCalendarEvent({
      ...calendarEvent,
      [event?.target?.name]: event?.target?.value,
    });
  };
  const handleToggle = () => {
    if (toggle === "false") {
      setToggle("true");
    } else {
      setToggle("false");
    }
  };

  const handleDeleteEvent = (event) => {
    let id = event?.id;
    if (id) {
      try {
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .delete(`${process.env.REACT_APP_API_BASE_URL}/calendars/${id}`)
          .then((res) => {
            if (res?.statusText === "OK") {
              console.log("deleted");
            }
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
      handleClose();
    }
    handleClose();
  };
  const handleDateChange = (date, name) => {
    setCalendarEvent({
      ...calendarEvent,
      [name]: date,
    });
  };
  const handleSubmit = (event) => {
    let { id } = event?.id;
    if (id) {
      try {
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .put(`${process.env.REACT_APP_API_BASE_URL}/calanders/${id}`, {
            calander: {
              start_date: event?.start_date,
              end_date: event?.end_date,
              subject: event?.subject,
              location: event?.location,
            },
          })
          .then(() => {
            console.log(event);
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
      handleClose();
    } else {
      const newEvent = {
        subject: calendarEvent?.subject,
        location: calendarEvent?.location,
        start_date: new Date(calendarEvent?.start),
        end_date: new Date(calendarEvent?.end),
      };
      console.log(newEvent);
      try {
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/calanders`, {
            calander: {
              start_date: newEvent?.start_date,
              end_date: newEvent?.end_date,
              subject: newEvent?.subject,
              location: newEvent?.location,
            },
          })
          .then(() => {
            console.log(1);
            console.log(newEvent);
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
    }
  };

  let { location, subject, start, end } = calendarEvent;

  const { values, touched, errors } = useFormik({
    initialValues: Calendar,
    validationSchema: Calendar_Validation,
  });
  return (
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
          onChange={handleChange}
          type="text"
          name="subject"
          value={subject || ""}
          multiline={true}
          validators={["required"]}
          errorMessages={["this field is required"]}
          style={{ width: "100%", marginBottom: "24px" }}
        />
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
        <Grid container spacing={4}>
          <Grid item sm={6} xs={12}>
            <DateTimePicker
              onChange={(date) => handleDateChange(date, "start")}
              value={start}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <DateTimePicker
              onChange={(date) => handleDateChange(date, "end")}
              value={end}
            />
          </Grid>
        </Grid>

        {toggle === "false" && (
          <Grid item xs={6}>
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
              style={{ width: "100%", marginBottom: "4px", marginTop: "24px" }}
            />
          </Grid>
        )}
        <FormControlLabel
          control={<Switch onChange={handleToggle} />}
          label="Invite Members"
        />
        <DialogFooter>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={handleDeleteEvent}>
            <Icon sx={{ mr: 1, verticalAlign: "middle" }}>delete</Icon>
            Delete
          </Button>
        </DialogFooter>
      </Box>
    </Dialog>
  );
};

export default EventEditorDialog;
