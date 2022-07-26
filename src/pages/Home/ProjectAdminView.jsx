import Grid from "@material-ui/core/Grid";
import Joyride from "react-joyride";
import { Container } from "components";
import AvailableProjects from "./Components/AvailableProjects";
import Calander from "./Components/Calendar";
import ChatModule from "./Components/ChatModule";
import Communication from "./Components/Communication";
import DocumentManager from "./Components/DocumentManager";
import Library from "./Components/Library";
import ProjectInformation from "./Components/ProjectInformation";
import ProjectSettings from "./Components/ProjectSettings";
import Reports from "./Components/Reports";
import { steps } from "../../shared/utilities/appTour";

const ProjectAdminView = ({ history, location }) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Joyride
          run={true}
          continuous
          showProgress
          showSkipButton
          // enabled={stepsEnabled}
          steps={steps}
          // initialStep={initialStep}
          // onExit={onExit}
        />
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <AvailableProjects
            history={history}
            location={location}
          ></AvailableProjects>
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <ProjectInformation history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <ProjectSettings history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Communication history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Calander history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DocumentManager history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Library history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Reports history={history} location={location} />
        </Grid>
      </Grid>
      <ChatModule></ChatModule>
      {/* <ChatBox></ChatBox> */}
    </Container>
  );
};
export default ProjectAdminView;
