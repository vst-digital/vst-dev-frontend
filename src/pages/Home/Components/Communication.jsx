import { Avatar, makeStyles } from "@material-ui/core";
import { ChatBubble } from "@material-ui/icons";

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

const Communication = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes?.avatar}>
      <ChatBubble className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    title: "Communication",
    path: "/communications",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default Communication;
