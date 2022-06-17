import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    boxShadow: theme.shadows[2],
  },
  title: { fontWeight: 700 },
}));
