import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import Voice from "./Voice/index"
import Chat from "./Chat/index"
import Meeting from "./Meeting/index"
import Memo from "./Memo/index"
import { Button } from "@material-ui/core";
import MemoTemplate from "./MemoTemplate/index";


const CommunicationIndex = ({ history, location }) => {
    const project_id = localStorage.getItem('project_id');
    if (project_id) {
        return (
            <Container title="Communication">

                <Grid container spacing={2}>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Voice history={history} location={location}></Voice>
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Chat history={history} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Meeting history={history} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <Memo history={history} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <MemoTemplate history={history} />
                    </Grid>
                </Grid>
            </Container>
        );
    }
};

export default CommunicationIndex;
