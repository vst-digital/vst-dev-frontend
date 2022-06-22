import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import AvailableProjects from "./Components/AvailableProjects";
import Calendar from "./Components/Calendar";
import Communication from "./Components/Communication";
import DocumentManager from "./Components/DocumentManager";
import Library from "./Components/Library";
import ChatModule from "./Components/ChatModule";
import Inspection from "./Components/Inspection";
const MemberView = ({ history, location }) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <AvailableProjects
            history={history}
            location={location}
          ></AvailableProjects>
        </Grid>

        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Communication history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Inspection history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Calendar history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DocumentManager history={history} location={location} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Library history={history} location={location} />
        </Grid>
      </Grid>
      <ChatModule></ChatModule>
      {/* <ChatBox></ChatBox> */}
    </Container>
  );
};

export default MemberView;
