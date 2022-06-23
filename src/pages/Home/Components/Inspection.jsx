import { Avatar, makeStyles } from "@material-ui/core";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import CardComp from "./common/CardComp";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56,
  },
  icon: {
    height: 32,
    width: 32,
  },
}));

const Inspection = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes.avatar}>
      <AssignmentTurnedInIcon className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    title: "Inspection Sheets",
    path: "/Inspection",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default Inspection;
