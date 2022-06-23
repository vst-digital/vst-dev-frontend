import { ReactFormBuilder } from "react-form-builder2";
import SideBar from "../../Components/SideBar/SideBar";
import "react-form-builder2/dist/app.css";
import "../../Components/SideBar/styes/CommunicationBase.scss";
import { Container } from "components";

const CreateUpdateMemo = (props) => {
  return (
    <Container container spacing={2}>
      <div className="communication-wrapper">
        <ReactFormBuilder />
        <SideBar props={props} />
      </div>
    </Container>
  );
};

export default CreateUpdateMemo;
