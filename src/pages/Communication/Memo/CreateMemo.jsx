import { useEffect, useState } from "react";
import get from "lodash/get";
import { useFormik } from "formik";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography
} from "@material-ui/core";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import DeleteIcon from "@material-ui/icons/Delete";
import DownwardIcon from "@material-ui/icons/ArrowDownward";
import UpwardIcon from "@material-ui/icons/ArrowUpward";

import { useHttp } from "hooks";
import { AsyncSelect, Container, Panel, TextField } from "components";
import { Memo } from "shared/models";
import { FIELD_SIZE, HOURS, KM, LATLNG } from "shared/utilities/constant";
import { Memo_Validation } from "shared/utilities/validationSchema.util";
// import { postMemoTemplate } from "shared/services";
import { ReactFormGenerator, ElementStore } from 'react-form-builder2';
import { getMemoTemplates, getMembers, getMemos, getMemo, postMemo, deleteMemo } from "shared/services";
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
  }
}));

const CreateMemberMemo = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const action = location.state?.data?.action || 'Add';
  const memo = new Memo(location.state?.data?.memo);
  const [preview, setpreview] = useState(false)
  const [template, setTemplate] = useState("")

  const onConfirm = async () => {
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
    getSelectDataSource(requestHandler, getMembers(params))
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });

  const onTemplateChange = (template_instance) => {
    if (template_instance) {
      setpreview(true);
      setTemplate(template_instance.template);
      const memo = new Memo(values)
      memo.template = template_instance
      setValues(memo)
    } else {
      setpreview(false);
      setTemplate("");
      const memo = new Memo(values)
      memo.template = ""
      setValues(memo)
    }
  }

  const onReceiverChange = (receiver_instance) => {
    if (receiver_instance) {
      const memo = new Memo(values)
      memo.to = receiver_instance.id
      setValues(memo);
    } else {
      const memo = new Memo(values)
      memo.to = ""
      setValues(memo);
    }
  }

  const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
    initialValues: memo,
    validationSchema: Memo_Validation,
    onSubmit: onConfirm
  });


  return (
    <form onSubmit={handleSubmit}>
      <Container title={`${action} Memo`} actions={
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
                    id={"template"}
                    getOptionLabel={getMemoTemplateLable}
                    loadingMethod={getMemoTemplateList}
                    value={values.template}
                    onChange={onTemplateChange}
                    error={touched.template && Boolean(errors.template)}
                    helperText={touched.template && errors.template}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Receiver</Typography>
                  <AsyncSelect
                    id={"to"}
                    getOptionLabel={getMemberLabel}
                    loadingMethod={getReceiverList}
                    value={values.receiver}
                    onChange={onReceiverChange}
                    error={touched.to && Boolean(errors.to)}
                    helperText={touched.to && errors.to}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Subject</Typography>
                  <TextField
                    id="subject"
                    value={values.subject} onChange={handleChange}
                    error={touched.subject && Boolean(errors.subject)}
                    helperText={touched.subject && errors.subject}
                  />
                </Grid>
                {preview && <Grid item xs={12}>
                  <Typography>Selected Template</Typography>
                  <ReactFormGenerator
                    answer_data={{}}
                    action_name="Save"
                    data={template}
                    hide_actions={true}
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