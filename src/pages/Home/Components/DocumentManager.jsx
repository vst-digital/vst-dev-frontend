import { Avatar, makeStyles } from "@material-ui/core";
import { SaveRounded } from "@material-ui/icons";

import CardComp from "./common/CardComp";

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 32,
    width: 32,
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56,
  },
}));

const DocumentManager = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes?.avatar}>
      <SaveRounded className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    id: "file-manager",
    title: "File Manager",
    path: "/storages",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default DocumentManager;
