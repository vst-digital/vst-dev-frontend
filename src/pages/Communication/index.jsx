import Grid from "@material-ui/core/Grid";
import { Container } from "components";
// import { Button } from "@material-ui/core";
import { ReactFormBuilder } from 'react-form-builder2';
import SideBar from "./Components/SideBar";
import * as variables from '../FormBuilder/variables'
import 'react-form-builder2/dist/app.css';
import "./styes/CommunicationBase.scss"


const Home = ({ history, location }) => {

  return (
    <Container>
      <Grid>
        <div className="communication-wrapper">
          <ReactFormBuilder/>
          <SideBar />
        </div>
      </Grid>
    </Container>
  )
};

export default Home;

