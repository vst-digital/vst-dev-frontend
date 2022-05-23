import { useEffect, useState } from "react";
import get from "lodash/get";
import { useFormik } from "formik";
import {
  Button,
  Grid,
  makeStyles,
  Typography
} from "@material-ui/core";
import 'react-form-builder2/dist/app.css';
import "../Components/SideBar/styes/CommunicationBase.scss"

import { useHttp } from "hooks";
import { AsyncSelect, Container, Panel, TextField } from "components";
import { Memo } from "shared/models";
import { Memo_Validation } from "shared/utilities/validationSchema.util";
// import { postMemoTemplate } from "shared/services";
import { ReactFormGenerator, ElementStore } from 'react-form-builder2';
import { getMemoTemplates, getMembers, getMemos, getMemo, postMemo, deleteMemo, getAllMembersList } from "shared/services";
import {
  getMemoTemplateLable,
  getSelectDataSource,
  getMemberLabel,
} from "shared/utilities/common.util";



const useStyles = makeStyles((theme) => ({
  action: { marginRight: theme.spacing(1) },
  rowActions: {
    '& > :first-child :hover': { color: theme.palette.error.dark },
    '& > :not(:first-child) :hover': { color: theme.palette.primary.dark },
    '& > :not(:last-child)': { marginRight: theme.spacing(.5) }
  },
  noDataFound: {
    display: 'flex',
    justifyContent: 'center'
  },
  link: {
    margin: "1%",
    cursor: "pointer",
  }
}));

const CreateMemberMemo = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const action = location.state?.data?.action || 'Add';
  const memo = new Memo(location.state?.data?.memo);
  const [preview, setpreview] = useState(false);
  const [template, setTemplate] = useState("");
  const [answers, setAnswers] = useState([]);
  const [bccPerview, setBccPerview] = useState(false);
  const [ccPerview, setCcPerview] = useState(false);

  const onConfirm = async () => {
    values.answers = answers
    const payload = { project_user_memo: values };
    try {
      const requestConfig = postMemo(payload);
      await requestHandler(requestConfig, { loader: true });
      notify({ msg: 'Memo has been sent successfully!!', type: 'success' });
      history.push('/memo/all');
    } catch (e) {
      notify({ msg: 'Not able to send memo. Something went wrong!!', type: 'error' });
    }
  };

  const getMemoTemplateList = () => new Promise((resolve, reject) => {
    const params = { per_page: 500, page_no: 1, sort: 'created_at.desc' };
    getSelectDataSource(requestHandler, getMemoTemplates(params))
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });

  const getReceiverList = () => new Promise((resolve, reject) => {
    const params = { per_page: 500, page_no: 1, sort: 'created_at.desc' };
    getSelectDataSource(requestHandler, getAllMembersList(params))
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });

  const onTemplateChange = (template_instance) => {
    if (template_instance) {
      setpreview(true);
      setTemplate(template_instance.template);
      const memo = new Memo(values)
      memo.body = template_instance
      setValues(memo)
    } else {
      setpreview(false);
      setTemplate("");
      const memo = new Memo(values)
      memo.body = ""
      setValues(memo)
    }
  }

  const onReceiverChange = (receiver_instance) => {
    if (receiver_instance) {
      const memo = new Memo(values)
      memo.receiver_id = receiver_instance
      setValues(memo);
    } else {
      const memo = new Memo(values)
      memo.receiver_id = ""
      setValues(memo);
    }
  }

  const onCcChange = (receiver_instance) => {
    if (receiver_instance) {
      const memo = new Memo(values)
      memo.cc = receiver_instance
      setValues(memo);
    } else {
      const memo = new Memo(values)
      memo.cc = ""
      setValues(memo);
    }
  }

  const onBccChange = (receiver_instance) => {
    if (receiver_instance) {
      const memo = new Memo(values)
      memo.bcc = receiver_instance
      setValues(memo);
    } else {
      const memo = new Memo(values)
      memo.bcc = ""
      setValues(memo);
    }
  }

  const OnMemoChange = (data) => {
    if (data.length != 0) {
      let new_answers = answers.filter(x=> x.name != data.target.name)
      setAnswers([...new_answers, {name: data.target.name, value: data.target.value}])
    }
  }

  const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
    initialValues: memo,
    validationSchema: Memo_Validation,
    onSubmit: onConfirm
  });


  return (
    <form onSubmit={handleSubmit}>
      <Container title={`Compose Memo`} actions={
        <>
          <Button type="submit" color="primary" variant="contained">Send</Button>
          <Button variant="contained" onClick={() => history.push('/memo/all')}>Cancel</Button>
        </>
      }>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Panel title="Memo">
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={6}>
                  <Typography gutterBottom>Select Template</Typography>
                  <AsyncSelect
                    id={"body"}
                    getOptionLabel={getMemoTemplateLable}
                    loadingMethod={getMemoTemplateList}
                    value={values.body}
                    onChange={onTemplateChange}
                    error={touched.template && Boolean(errors.template)}
                    helperText={touched.template && errors.template}
                  />
                </Grid>
                <Grid item xs={6} direction="row">
                    <Typography gutterBottom>Receiver</Typography>
                    <AsyncSelect
                      id={"receiver_id"}
                      getOptionLabel={(getMemberLabel) => getMemberLabel.email || ""}
                      loadingMethod={getReceiverList}
                      value={values.receiver_id}
                      onChange={onReceiverChange}
                      error={touched.receiver_id && Boolean(errors.receiver_id)}
                      helperText={touched.receiver_id && errors.receiver_id}
                      multiple
                      // freesolo
                    />
                    {/* <a onClick={() => setCcPerview(true)} className={classes.link}>Cc</a> */}
                    {/* <a onClick={() => setBccPerview(true)} className={classes.link}>Bcc</a> */}
                </Grid>
                
                {/* {ccPerview && <Grid item xs={6}>
                  <Typography gutterBottom>CC</Typography>
                  <AsyncSelect
                    id={"cc"}
                    getOptionLabel={(getMemberLabel) => getMemberLabel.email || ""}
                    loadingMethod={getReceiverList}
                    value={values.cc}
                    onChange={onCcChange}
                    error={touched.receiver_id && Boolean(errors.receiver_id)}
                    helperText={touched.receiver_id && errors.receiver_id}
                    multiple
                  />
                </Grid>} */}
                {bccPerview && <Grid item xs={6}>
                  <Typography gutterBottom>Bcc</Typography>
                  <AsyncSelect
                    id={"bcc"}
                    getOptionLabel={(getMemberLabel) => getMemberLabel.email || ""}
                    loadingMethod={getReceiverList}
                    value={values.bcc}
                    onChange={onBccChange}
                    error={touched.receiver_id && Boolean(errors.receiver_id)}
                    helperText={touched.receiver_id && errors.receiver_id}
                    multiple
                  />
                </Grid>}
                <Grid item xs={6}>
                  <Typography gutterBottom>Subject</Typography>
                  <TextField
                    id="subject"
                    value={values.subject} onChange={handleChange}
                    error={touched.subject && Boolean(errors.subject)}
                    helperText={touched.subject && errors.subject}
                  />
                </Grid>
                {preview && <Grid item xs={12} onChange={OnMemoChange}>
                  <Typography>Selected Template</Typography>
                  <ReactFormGenerator
                    id="react_form_generator"
                    answer_data={{}}
                    action_name="Save"
                    data={template}
                    hide_actions={true}
                    onChange={OnMemoChange}
                    // onChange={(evt) => OnMemoChange(evt)}
                    // (e, newValue) => onChange(newValue)
                  />
                </Grid>}
              </Grid>
            </Panel>
          </Grid>
        </Grid>
      </Container>
    </form>
  )
}

export default CreateMemberMemo;