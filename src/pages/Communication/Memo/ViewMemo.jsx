import { useState, useEffect } from "react";
import { Button, makeStyles, Grid, Typography, Card, Paper, styled, Divider, Chip, Avatar } from "@material-ui/core";
import { DisplayField, Panel, RowDivider } from "components";
import { useHttp } from "hooks";
import { useFormik } from "formik";
import { postMemoReply } from "shared/services";
import { Memo, MemoReply } from "shared/models";
import { Memo_Reply_Validation } from "shared/utilities/validationSchema.util";
import { createArray, formatDateTime } from "shared/utilities/common.util";
import { Container } from "components";
import { ReactFormGenerator, ElementStore } from 'react-form-builder2';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Parser } from 'html-to-react'
import 'react-form-builder2/dist/app.css';
import "../Components/SideBar/styes/CommunicationBase.scss"
import actionCable from "actioncable";
import * as React from 'react';
import useSound from 'use-sound';
import alertSound from '../../../assets/sounds/alert.wav'
const useStyles = makeStyles(theme => ({
  divPadding: {
    padding: "4%"
  },
  communication_wrapper: {
    padding: "2%"
  },
  editor: {
    "& .ck-editor__main > .ck-editor__editable": {
      minHeight: "200px"
    }
  },
  panelMargin: {
    marginTop: "1%",
    marginBottom: "1%"
  },
}))

const ViewMemberMemo = (props) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const memo = props?.location?.state?.data?.memo;
  const memo_replies = memo?.project_user_memo_replies;
  const [reply, setReply] = useState();
  const memo_reply = new MemoReply();
  const [play] = useSound(alertSound);
  

  const onConfirm = async () => {
    values.project_user_memo_id = memo.id;
    const payload = { project_user_memo_reply: values };
    try {
      const requestConfig = postMemoReply(payload);
      await requestHandler(requestConfig, { loader: true });
      notify({ msg: 'Reply has been sent successfully!!', type: 'success' });
    } catch (e) {
      notify({ msg: 'Not able to send reply. Something went wrong!!', type: 'error' });
    }
  };

  const onEditorChange = (data) => {
    const memo_reply = new MemoReply(values);
    memo_reply.content = data;
    setValues(memo_reply);
  }

  const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
    initialValues: memo_reply,
    validationSchema: Memo_Reply_Validation,
    onSubmit: onConfirm
  });

  useEffect(
    () => {
      const CableApp = {}
      CableApp.cable = actionCable.createConsumer(process.env.REACT_APP_BASE_CABLE)
      CableApp.cable.subscriptions.create({
        channel: 'MemoReplyChannel',
        room: localStorage.getItem('user_id'),
        user: localStorage.getItem('token')
      },
        {
          received: (res) => {
            const data = JSON.parse(res["message"])
            setReply(prev => [...prev, data.data.attributes]);
            const memo_reply = new MemoReply(values);
            memo_reply.content = "";
            setValues(memo_reply);
            document.getElementsByClassName("ck-editor__editable")[0].textContent = "";
            play();
          },
          connected: () => {
            console.log("Online")
          }
        });
    },
    []
  )

  useEffect(() => {
    setTimeout(() => {
      setReply(memo_replies);
      play();
    }, 1000);
  },[]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  return (<>
    <Container className={classes.divPadding}>
      <Grid>
        <Card className={classes.communication_wrapper}>
        {/* <button onClick={playSound}>Boop!</button>; */}
          <Typography variant="h3">{memo.subject}</Typography>
          <Divider variant="fullWidth" component="div" />
          <Chip className={classes.panelMargin} avatar={<Avatar>{memo.sender.first_name[0]}</Avatar>} variant="outlined" label={memo.sender.email} /> To: {memo.receiver.email}
          <Divider variant="fullWidth" component="div" />
          <ReactFormGenerator
            back_action="/"
            back_name="Back"
            answer_data={memo.answers}
            action_name="Save"
            data={memo.body}
            hide_actions={true}
            read_only
          />
        </Card>
      </Grid>
    </Container>
    <Container>
      {reply && reply.map(reply =>
        <div className={classes.panelMargin}>
          <Panel title={reply.created_by.email}>
            <Grid container spacing={2}>
              {/* <Item>{formatDateTime(reply.created_at)}</Item> */}
              {/* <Typography variant="body1">{formatDateTime(reply.created_at)}</Typography> */}
              <Divider variant="fullWidth" component="div" />
              <Typography variant="body1">{Parser().parse(reply.content)}</Typography>
            </Grid>
          </Panel>
        </div>

      )}
      <Grid>
        <form onSubmit={handleSubmit}>
          <Container className={classes.communication_wrapper} actions={
            <>
              <Button type="submit" color="primary" variant="contained">Reply</Button>
            </>
          }>
            <div className={classes.editor}>
              <CKEditor
                id={"content"}
                value={values.content}
                editor={ClassicEditor}
                onReady={editor => {
                }}
                className={classes.ckEditor}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  onEditorChange(data);
                }}
              />
            </div>
          </Container>
        </form>
      </Grid>
    </Container>
  </>)
};

export default ViewMemberMemo;