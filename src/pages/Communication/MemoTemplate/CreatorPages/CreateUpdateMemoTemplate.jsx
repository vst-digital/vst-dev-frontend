import { ReactFormBuilder } from "anubhav-react-form-builder";
import "anubhav-react-form-builder/dist/app.css";
import { Container } from "components";
import Demobar from "pages/Communication/Components/FormBuilder/demobar";
import { templateItems } from "shared/utilities/formBuilder";
import "../../Components/FormBuilder/demobarstyle.scss";
import "../../Components/FormBuilder/formstyle.scss";

const CreateUpdateMemo = () => {
  return (
    <Container container spacing={2}>
      <div className="communication-wrapper">
        <ReactFormBuilder toolbarItems={templateItems} />
        <Demobar />
      </div>
    </Container>
  );
};

export default CreateUpdateMemo;
