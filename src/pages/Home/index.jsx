import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import AvailableProjects from "./Components/AvailableProjects";
import Calander from "./Components/Calander";
import Communication from "./Components/Communication";
import DocumentManager from "./Components/DocumentManager";
import Library from "./Components/Library";
import ProjectInformation from "./Components/ProjectInformation";
import ProjectSettings from "./Components/ProjectSettings";
import Reports from "./Components/Reports";
import SelectProject from "./Components/SelectProject";
import { Button } from "@material-ui/core";


const Home = ({ history, location }) => {
    const project_id = localStorage.getItem('project_id');
    if (project_id){
        return (
            <Container title="Home">
                <Grid container spacing={2}>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <AvailableProjects history={history} location={location}></AvailableProjects>
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <ProjectInformation />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <ProjectSettings history={history}/>
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Communication history={history}/>
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Calander />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <DocumentManager />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Library />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Reports />
                    </Grid>
                </Grid>
            </Container>
        );
    }
    return (
        <Container title="Home">
            <Grid container spacing={2}>
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <SelectProject history={history}></SelectProject>
                </Grid>
            </Grid>
        </Container>
    );
     
};

export default Home;
