import { Box, styled } from "@mui/system";
import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  Button,
  Icon,
  Grid,
  TextField,
} from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addNewEvent, updateEvent, deleteEvent } from "../../shared/services/calendar.service";
import { DateTimePicker } from "@material-ui/pickers";

const DialogFooter = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const DialogHeader = styled(DialogFooter)(() => ({
  padding: "10px 15px",
}));

const EventEditorDialog = ({ event = {}, open, handleClose }) => {
  const [state, setState] = useState(event);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = () => {
    let { id } = state;
    if (id) {
      updateEvent({
        ...state,
      }).then(() => {
        handleClose();
      });
    } else {
      addNewEvent({
        id: generateRandomId(),
        ...state,
      }).then(() => {
        handleClose();
      });
    }
  };
  const handleDeleteEvent = () => {
    if (state.id) {
      deleteEvent(state).then(() => {
        handleClose();
      });
    }
  };
  const handleDateChange = (date, name) => {
    setState({
      ...state,
      [name]: date,
    });
  };
  const generateRandomId = () => {
    let tempId = Math.random().toString();
    let id = tempId.substr(2, tempId.length - 1);
    return id;
  };
  let { title, location, note } = state;

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
      <DialogHeader>
        <h1> Add Events</h1>
        <IconButton onClick={handleClose}>
          <Icon sx={{ color: "#fff" }}>clear</Icon>
        </IconButton>
      </DialogHeader>

      <Box p={2}>
        <ValidatorForm onSubmit={handleFormSubmit}>
          <TextValidator
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
          <TextValidator
            label="Location"
            onChange={handleChange}
            type="text"
            name="location"
            value={location || ""}
            validators={["required"]}
            errorMessages={["this field is required"]}
            style={{ width: "100%", marginBottom: "24px" }}
          />

          <TextValidator
            label="Note"
            onChange={handleChange}
            type="text"
            name="note"
            value={note || ""}
            multiline={true}
            validators={["required"]}
            errorMessages={["this field is required"]}
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
        </ValidatorForm>
      </Box>
    </Dialog>
  );
};

export default EventEditorDialog;
