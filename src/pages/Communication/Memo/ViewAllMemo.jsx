import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import RecievedEmails from "./Components/RecievedEmails";
import SentEmails from "./Components/SentEmails";
import NewTemplate from "./Components/NewTemplate";

const useStyles = makeStyles((theme) => ({
  tabsRoot: { borderBottom: `1px solid ${theme.palette.grey[300]}` },
}));

const ViewAllMemo = ({ history }) => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (e, index) => setTabIndex(index);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Tabs
          indicatorColor={"primary"}
          className={classes?.tabsRoot}
          value={tabIndex}
          onChange={handleChange}
        >
          <Tab label={"Templates"} />
          <Tab label={"Memos"} />
        </Tabs>
      </Grid>
      {tabIndex === 0 && (
        <Grid item xs={12}>
          <NewTemplate history={history} />
        </Grid>
      )}
      {tabIndex === 1 && (
        <Grid item xs={12}>
          <Grid item xs={12}>
            <RecievedEmails history={history} />
            <SentEmails history={history} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ViewAllMemo;
