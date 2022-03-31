import Grid from "@material-ui/core/Grid";

import {Container} from "components";
import Budget from "./components/Budget";
import TotalUsers from "./components/TotalUsers";
import TasksProgress from "./components/TasksProgress";
import TotalProfit from "./components/TotalProfit";
import LatestSales from "./components/LatestSales";
import UsersByDevice from "./components/UsersByDevice";

const Dashboard = () => {
    return (
        <Container title="Dashboard">
            <Grid container spacing={2}>
                <Grid item lg={3} sm={6} xl={3} xs={12}><Budget/></Grid>
                <Grid item lg={3} sm={6} xl={3} xs={12}><TotalUsers/></Grid>
                <Grid item lg={3} sm={6} xl={3} xs={12}><TasksProgress/></Grid>
                <Grid item lg={3} sm={6} xl={3} xs={12}><TotalProfit/></Grid>

                <Grid item lg={8} md={12} xl={9} xs={12}><LatestSales/></Grid>
                <Grid item lg={4} md={6} xl={3} xs={12}><UsersByDevice/></Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
