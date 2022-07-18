import { Avatar, makeStyles } from "@material-ui/core";
import { AccountTree } from "@material-ui/icons";

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

const ProjectInformation = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes.avatar}>
      <AccountTree className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    id: "project-information",
    title: "Project Information",
    path: "/projectInformation",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default ProjectInformation;
