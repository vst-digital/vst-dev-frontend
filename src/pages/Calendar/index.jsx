import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import React, { useState, useEffect, useRef } from "react";
import { useHttp } from "hooks";
import { Button } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import {
  getCalanderEvent
} from "../../shared/services/calendar.service";
import EventEditorDialog from "./EventEditorDialog";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: {
    margin: "16px",
  },
  background: "white",
}));

const CalendarRoot = styled("div")(({ theme }) => ({
  height: "80vh",
  display: "flex",
  flexDirection: "column",
}));

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
let viewList = Object.keys(Views)?.map((key) => Views[key]);

const EventCalendar = (props) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(null);
  const { notify, requestHandler } = useHttp();
  const [shouldShowEventDialog, setShouldShowEventDialog] = useState(false);
  const headerComponentRef = useRef(null);
  
  const getCalanderEvents = async ()=>{
    const payload = {};
    try {
      const requestConfig = getCalanderEvent(payload);
      const res = await requestHandler(requestConfig, { loader: true });
      debugger
      setEvents(events);
      notify({ msg: 'Calander has been saved successfully!!', type: 'success' });
    } catch (e) {
      debugger
      notify({ msg: 'Not able to save calendar. Something went wrong!!', type: 'error' });
    }
  }

  useEffect(() => {
    getCalanderEvents();
  }, []);
  
  const handleDialogClose = () => {
    setShouldShowEventDialog(false);
    getCalanderEvents();
  };

  const openNewEventDialog = ({ action, ...event }) => {
    if (action === "doubleClick") {
      setNewEvent(event);
      setShouldShowEventDialog(true);
    }
  };
  const openExistingEventDialog = (event) => {
    setNewEvent(event);
    setShouldShowEventDialog(true);
  };

  return (
    <>
      <Button
        sx={{ mb: 2 }}
        variant="contained"
        color="primary"
        onClick={() =>
          openNewEventDialog({
            action: "doubleClick",
            start: new Date(),
            end: new Date(),
          })
        }
      >
        Add Event
      </Button>
      <Container>
        {shouldShowEventDialog && (
          <EventEditorDialog
            handleClose={handleDialogClose}
            open={shouldShowEventDialog}
            event={newEvent}
          />
        )}
        <CalendarRoot>
          <Box ref={headerComponentRef} />
          <DragAndDropCalendar
            selectable
            localizer={localizer}
            events={events}
            // onEventDrop={handleEventMove}
            resizable
            // onEventResize={handleEventResize}
            defaultView={Views.MONTH}
            defaultDate={new Date()}
            startAccessor="start"
            endAccessor="end"
            views={viewList}
            step={60}
            showMultiDayTimes
            onSelectEvent={(event) => {
              openExistingEventDialog(event);
            }}
            onSelectSlot={(slotDetails) => openNewEventDialog(slotDetails)}
          />
        </CalendarRoot>
      </Container>
    </>
  );
};

export default EventCalendar;
