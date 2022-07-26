import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Templates } from "./InspectionSheets";
import { Sheets } from "./Sheets";
const useStyles = makeStyles((theme) => ({
  tabsRoot: { borderBottom: `1px solid ${theme.palette.grey[300]}` },
}));

const Inspection = ({ history }) => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (e, index) => setTabIndex(index);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Tabs
          indicatorColor={"primary"}
          className={classes.tabsRoot}
          value={tabIndex}
          onChange={handleChange}
        >
          <Tab label={"Inspection Templates"} />
          <Tab label={"Inspection Sheets"} />
        </Tabs>
      </Grid>
      {tabIndex === 0 && (
        <Grid item xs={12}>
          <Templates history={history} />
        </Grid>
      )}
      {tabIndex === 1 && (
        <Grid item xs={12}>
          <Sheets history={history} />
        </Grid>
      )}
    </Grid>
  );
};

export default Inspection;
