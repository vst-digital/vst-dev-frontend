import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import ProjectInformation from "./Components/ProjectInformation";
import ProjectSettings from "./Components/ProjectSettings";
import Reports from "./Components/Reports";

const ProjectAdminView = ({ history, location }) => {
        return (
        <Container>
                <Grid container spacing={2}>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <ProjectInformation history={history} location={location}/>;
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <ProjectSettings history={history} location={location} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Reports history={history} location={location}/>
                    </Grid>
                </Grid>
            </Container>
        );
};
export default ProjectAdminView;
