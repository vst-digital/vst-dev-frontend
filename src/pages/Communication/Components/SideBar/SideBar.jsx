import React from 'react';
import { ReactFormGenerator, ElementStore } from 'react-form-builder2';
import { postMemoTemplate, getMemoTemplates, getMemoTemplate } from "shared/services/memo.service";
import axios from 'axios';
import { authFailure, authSuccess, checkAuthTimeout } from "store/actions/auth.actions";

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
    };
    const update = this._onChange.bind(this);
    ElementStore.subscribe(state => update(state.data));
  }

  showPreview() {
    this.setState({
      previewVisible: true,
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
    if (data.length != 0) {
      this.setState({ data });
    }
  }

  _onSubmit = async () => {
    if (this.state.data.length != 0) {
      try {
        axios.defaults.headers['Content-Type'] = 'application/json'
        axios.defaults.headers["accept"] = 'application/javascript'
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/user_memo_templates`, {
          memo_template: {
            json: this.state.data
          }
        })
        .then(res => {
          this.props.props.history.push("/memo_template/all")        
        })
        .catch(error => console.error(error));
      } catch (e) {
        console.log(e);
      }
    }
  };

  render() {
    let modalClass = 'modal';
    if (this.state.previewVisible) {
      modalClass += ' show d-block';
    }

    return (
      <div className="clearfix" style={{ margin: '10px', width: '70%' }}>
        <h4 className="float-left">Preview</h4>
        <button className="btn btn-primary float-right" style={{ marginRight: '10px' }} onClick={this.showPreview.bind(this)}>Preview Form</button>
        {this.state.previewVisible &&
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
                  onChange={this._onChange}
                  data={this.state.data}
                  onSubmit={this._onSubmit}
                  hide_actions={false}
                />
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
