import {useState} from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import Notification from "./components/Notification";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Subscription from "./components/Subscription";

const useStyles = makeStyles(theme => ({
    tabsRoot: {borderBottom: `1px solid ${theme.palette.grey[300]}`}
}));

const Account = () => {
    const classes = useStyles();

    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (e, index) => setTabIndex(index);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Tabs
                    indicatorColor={"primary"} className={classes.tabsRoot}
                    value={tabIndex} onChange={handleChange}
                >
                    <Tab label={"Profile"}/>
                    <Tab label={"Subscription"}/>
                    <Tab label={"Settings"}/>
                    <Tab label={"Notification"}/>
                </Tabs>
            </Grid>
            {tabIndex === 0 && <Grid item xs={12}><Profile/></Grid>}
            {tabIndex === 1 && <Grid item xs={12}><Subscription/></Grid>}
            {tabIndex === 2 && <Grid item xs={12}><Settings/></Grid>}
            {tabIndex === 3 && <Grid item xs={12}><Notification/></Grid>}
        </Grid>
    );
};

export default Account;
