import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ReportOffRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    boxShadow: theme.shadows[2],
  },
  content: {
    alignItems: "center",
    display: "flex",
  },
  title: { fontWeight: 700 },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56,
  },
  icon: {
    height: 32,
    width: 32,
  },
  difference: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  differenceIcon: {
    color: theme.palette.error.dark,
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1),
  },
}));

const ProjectSettings = ({ history, location }) => {
  const classes = useStyles();

  return (
    <Card id="reports" className={classes.root}>
      <CardContent>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              variant="h4"
              color="textSecondary"
              gutterBottom
            >
              Reports
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <ReportOffRounded className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => history.push("/reports")}
          >
            Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
