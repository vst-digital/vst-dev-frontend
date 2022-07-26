import { Avatar, makeStyles } from "@material-ui/core";
import { LibraryBooks } from "@material-ui/icons";

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

const Library = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes.avatar}>
      <LibraryBooks className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    id: "library",
    title: "Library",
    path: "/library",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default Library;
