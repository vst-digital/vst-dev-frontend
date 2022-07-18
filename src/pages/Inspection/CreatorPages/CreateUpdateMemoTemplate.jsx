import { ReactFormBuilder } from "anubhav-react-form-builder";
import "anubhav-react-form-builder/dist/app.css";
import { Container } from "components";
import Demobar from "pages/Inspection/Components/FormBuilder/demobar";
import { inspectionItems } from "shared/utilities/formBuilder";
import "../Components/FormBuilder/demobarstyle.scss";
import "../Components/FormBuilder/formstyle.scss";

const CreateUpdateMemo = () => {
  return (
    <Container container spacing={2}>
      <div className="communication-wrapper">
        <ReactFormBuilder toolbarItems={inspectionItems} />
        <Demobar />
      </div>
    </Container>
  );
};

export default CreateUpdateMemo;
