import { ReactFormBuilder } from 'react-form-builder2';
import SideBar from '../../Components/SideBar/SideBar';
import 'react-form-builder2/dist/app.css';
import "../../Components/SideBar/styes/CommunicationBase.scss"
import Grid from "@material-ui/core/Grid";
import { Container } from "components";

const CreateUpdateMemo = (props) => {
  return (
    <Container>
      <Grid>
        <div className="communication-wrapper">
          <ReactFormBuilder />
          <SideBar props={props} />
        </div>
      </Grid>
    </Container>
  )
}

export default CreateUpdateMemo;