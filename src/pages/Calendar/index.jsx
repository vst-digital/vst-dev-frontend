import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import * as ReactDOM from "react-dom";
import {
  getAllEvents,
  updateEvent,
} from "../../shared/services/calendar.service";
import CalendarHeader from "./CalendarHeader";
import EventEditorDialog from "./EventEditorDialog";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: {
    margin: "16px",
  },
  background: "white",
}));

const CalendarRoot = styled("div")(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
let viewList = Object.keys(Views)?.map((key) => Views[key]);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(null);
  const [shouldShowEventDialog, setShouldShowEventDialog] = useState(false);
  const headerComponentRef = useRef(null);
  const updateCalendar = () => {
    getAllEvents()
      .then((res) => res.data)
      .then((events) => {
        events = events?.map((e) => ({
          ...e,
          start: new Date(e?.start),
          end: new Date(e?.end),
        }));
        setEvents(events);
      });
  };

  const handleDialogClose = () => {
    setShouldShowEventDialog(false);
    updateCalendar();
  };
  const handleEventMove = (event) => {
    handleEventResize(event);
  };
  const handleEventResize = (event) => {
    updateEvent(event).then(() => {
      updateCalendar();
    });
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

  useEffect(() => {
    updateCalendar();
  }, []);
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
            onEventDrop={handleEventMove}
            resizable
            onEventResize={handleEventResize}
            defaultView={Views.MONTH}
            defaultDate={new Date()}
            startAccessor="start"
            endAccessor="end"
            views={viewList}
            step={60}
            showMultiDayTimes
            components={{
              toolbar: (props) => {
                return headerComponentRef.current ? (
                  ReactDOM.createPortal(
                    <CalendarHeader {...props} />,
                    headerComponentRef.current
                  )
                ) : (
                  <h3>There are no scheduled events</h3>
                );
              },
            }}
            // onNavigate={handleNavigate}
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
