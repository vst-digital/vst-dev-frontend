import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import SelectProject from "./Components/SelectProject";
import ProjectAdminView from "./ProjectAdminView";
import SiteOwnerView from "./SiteOwnerView";
import MemberView from "./MemberView";
const Home = ({ history, location }) => {
    const role = localStorage.getItem("role");
    const project_id = localStorage.getItem('project_id');
    
    if (project_id) {
        return (
            <Container title="Home">
                {role==="site_owner" &&   //site-owner and admin view are currently same till we add site-owner controls
                    <SiteOwnerView  history={history}></SiteOwnerView>}      
                {role==="project_admin" &&              
                    <ProjectAdminView history={history}></ProjectAdminView>}
            <hr/>
                    <MemberView history={history}></MemberView>
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
