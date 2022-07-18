import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { ElementStore, ReactFormGenerator } from "anubhav-react-form-builder";
import { useHttp } from "hooks";
import React, { useEffect, useState } from "react";
import { postMemoTemplate } from "shared/services";

import { useHistory } from "react-router-dom";
import "./demobarstyle.scss";

const Demobar = (props) => {
  const [data, setData] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const history = useHistory();
  const { notify, requestHandler } = useHttp();

  useEffect(() => {
    ElementStore.subscribe((state) => _onChange(state.data));
  }, []);

  const showPreview = () => {
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  const _onChange = (data) => {
    setData(data);
  };

  const _onSubmit = async (formData) => {
    console.log("onSubmit", formData);

    setOpen(true);
  };

  const handleOpen = async () => {
    const payload = {
      memo_template: {
        template: data,
      },
    };

    try {
      const requestConfig = postMemoTemplate(payload);
      await requestHandler(requestConfig, { loader: true });

      history.push("/memo_template/all");
      setOpen(false);
    } catch (e) {
      notify({
        msg: "Coundln't save the template. Something went wrong!!",
        type: "error",
      });
    }
  };

  const handleClose = () => setOpen(false);

  const _templateNameModal = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter a name for the template:</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To save this template, please enter a name here. We will save the
          template with your entered name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Template name"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOpen}>save</Button>
      </DialogActions>
    </Dialog>
  );

  let modalClass = "modal";
  if (previewVisible) {
    modalClass += " show d-block";
  }

  return (
    <div className="demobar-wrapper">
      <h4 className="float-left">Preview</h4>
      <button
        className="btn btn-primary float-right"
        style={{ marginRight: "10px" }}
        onClick={showPreview}
      >
        Preview Form
      </button>

      {open && _templateNameModal()}

      {previewVisible && (
        <div className={modalClass}>
          <div className="modal-dialog">
            <div className="modal-content">
              <ReactFormGenerator
                download_path=""
                answer_data={{}}
                action_name="Save"
                onSubmit={_onSubmit}
                variables={props.variables}
                data={data}
              />

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  onClick={closePreview}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demobar;
