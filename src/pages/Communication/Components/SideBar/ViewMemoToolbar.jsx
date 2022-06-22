import React from "react";
import { ReactFormGenerator, ElementStore } from "react-form-builder2";
import {
  postMemoTemplate,
  getMemoTemplates,
  getMemoTemplate,
} from "shared/services/memo.service";
import axios from "axios";

export default class ViewMemoToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
      shortPreviewVisible: false,
      roPreviewVisible: false,
    };
    const update = this._onChange.bind(this);
    // const { notify, requestHandler } = useHttp();
    ElementStore.subscribe((state) => update(state.data));
  }

  showPreview() {
    this.setState({
      previewVisible: true,
    });
  }

  showShortPreview() {
    this.setState({
      shortPreviewVisible: true,
    });
  }

  showRoPreview() {
    this.setState({
      roPreviewVisible: true,
    });
  }

  closePreview() {
    this.setState({
      previewVisible: false,
      shortPreviewVisible: false,
      roPreviewVisible: false,
    });
  }

  _onChange(data) {
    this.setState({
      data,
    });
  }

  _onSubmit = async (values) => {
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios.defaults.headers["Authorization"] =
        localStorage.getItem("Authorization");
      axios
        .post(process.env.REACT_APP_API_BASE_URL + "/user_memo_templates", {
          memo_template: {
            json: values,
          },
        })
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {}
  };

  render() {
    let modalClass = "modal";
    if (this.state.previewVisible) {
      modalClass += " show d-block";
    }
    modalClass = "modal show d-block";

    let content = "";
    if (this.props.props.location.state.data.memoTemplate) {
      content = this.props.props.location.state.data.memoTemplate.template;
    } else {
      content = this.props.props.location.state.data.memo.body;
    }

    return (
      <div className="clearfix" style={{ margin: "10px", width: "100%" }}>
        <h4 className="float-left">Preview</h4>
        {/* <button className="btn btn-primary float-right" style={{ marginRight: '10px' }} onClick={this.showPreview.bind(this)}>Preview Form</button> */}

        {
          <div className={modalClass}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <ReactFormGenerator
                  download_path=""
                  back_action="/"
                  back_name="Back"
                  answer_data={{}}
                  action_name="Save"
                  variables={this.props.variables}
                  data={content}
                  // onSubmit={this._onSubmit}
                  hide_actions={true}
                />
                <div className="modal-footer">
                  {/* <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button> */}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
