import { Avatar, makeStyles } from "@material-ui/core";
import MapIcon from "@mui/icons-material/Map";
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

const Maps = () => {
  const classes = useStyles();

  const IconComp = () => (
    <Avatar className={classes.avatar}>
      <MapIcon className={classes.icon} />
    </Avatar>
  );

  const cardProps = {
    title: "Maps",
    path: "/Maps",
    IconComp,
  };

  return <CardComp {...cardProps} />;
};

export default Maps;
