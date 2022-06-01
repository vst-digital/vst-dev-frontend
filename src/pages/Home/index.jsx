import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import SelectProject from "./Components/SelectProject";
import ProjectAdminView from "./ProjectAdminView";
import SiteOwnerView from "./SiteOwnerView";
import MemberView from "./MemberView";
const Home = ({ history, location }) => {
    const user = localStorage.getItem("user");
    const project_id = localStorage.getItem('project_id');
    if (project_id) {
        return (
            <Container title="Home">
            {user==="site_owner" &&   //site-owner and admin view are currently same till we add site-owner controls
            <SiteOwnerView history={history}></SiteOwnerView>}      
            {user==="project_admin" &&              
             <ProjectAdminView history={history}></ProjectAdminView>}
             {user==="project_member" && 
             <MemberView history={history}></MemberView>}
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
