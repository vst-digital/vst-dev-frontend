import Grid from "@material-ui/core/Grid";
import { Container } from "components";
import { ReactFormBuilder } from 'react-form-builder2';
import ViewMemoToolbar from "pages/Communication/Components/SideBar/ViewMemoToolbar";
import 'react-form-builder2/dist/app.css';
import "../../Components/SideBar/styes/CommunicationBase.scss"

const ViewMemo = (props) => {
  return (
    <>
      <Container>
        <Grid>
          <div className="communication-wrapper">
            {/* <ReactFormBuilder /> */}
            <ViewMemoToolbar props={props} />
          </div>
        </Grid>
      </Container>
    </>
  )
}

export default ViewMemo;