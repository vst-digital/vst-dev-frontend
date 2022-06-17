import { Avatar, makeStyles } from "@material-ui/core";
import { DateRangeRounded } from "@material-ui/icons";

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

const Field = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes?.avatar}>
      <DateRangeRounded className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    title: "Inspection Sheet",
    path: "/inspection_sheet",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default Field;
