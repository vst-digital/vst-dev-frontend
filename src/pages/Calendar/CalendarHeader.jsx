import React from "react";
import { styled, Box } from "@mui/system";
import { Tooltip, IconButton, Icon } from "@mui/material";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { viewNameListObject } from "./data/calendarData";
const CalenderHeader = styled("div")(() => ({
  display: "flex",
  padding: "4px 0px",
  justifyContent: "space-around",
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
}));

const CalendarHeader = (props) => {
  const {
    views: viewNameList,
    view: currentView,
    label,
    onView,
    onNavigate,
  } = props;

  const renderViewButtons = () => {
    if (viewNameList?.length > 1) {
      return viewNameList?.map((view) => (
        <IconButton
          key={view}
          size="large"
          aria-label={view}
          onClick={() => onView(view)}
          disabled={currentView === view}
        >
          <Tooltip title={viewNameListObject[view]?.name}>
            <Icon sx={{ color: "gray" }}>{viewNameListObject[view]?.icon}</Icon>
          </Tooltip>
        </IconButton>
      ));
    }
  };
  return (
    <CalenderHeader>
      <Box display="flex" justifyContent="center">
        <IconButton size="large" onClick={() => onNavigate(navigate.PREVIOUS)}>
          <Tooltip title="Previous">
            <Icon sx={{ color: "gray" }}>chevron_left</Icon>
          </Tooltip>
        </IconButton>

        <IconButton size="large" onClick={() => onNavigate(navigate.TODAY)}>
          <Tooltip title="Today">
            <Icon sx={{ color: "gray" }}>today</Icon>
          </Tooltip>
        </IconButton>

        <IconButton size="large" onClick={() => onNavigate(navigate.NEXT)}>
          <Tooltip title="Next">
            <Icon sx={{ color: "gray" }}>chevron_right</Icon>
          </Tooltip>
        </IconButton>
      </Box>

      <Box display="flex" alignItems="center">
        <h1 sx={{ color: "gray" }}>{label}</h1>
      </Box>

      <Box display="flex">{renderViewButtons()}</Box>
    </CalenderHeader>
  );
};
export default CalendarHeader;
