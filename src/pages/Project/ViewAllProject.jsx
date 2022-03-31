import * as React from "react";
import { useState } from "react";
import { useHttp } from "hooks";
import cx from 'clsx';
import { createArray } from "shared/utilities/common.util";
import { getProject, getProjects, postProject, putProject, deleteProject } from "shared/services";
import { ProjectSchema } from "shared/utilities/dataGridSchema";
import { Box, Button, Card, CardActions, CardContent, makeStyles, Menu, MenuItem, SvgIcon, Typography } from "@material-ui/core";
import AddRounded from "@material-ui/icons/AddRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Container, DisplayField, InlineTable, Panel, RowDivider, IndexTable } from "components";
import ViewIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace"
import { Project } from "shared/models";
import { setNestedObjectValues } from "formik";
import { useFormik } from "formik";

const useStyles = makeStyles(theme => ({
  moreBtn: {
    cursor: "pointer",
    "&:hover": { color: theme.palette.primary.dark }
  },
  actionIcon: {
    "& > :not(:last-child)": {
      marginRight: theme.spacing(1.5),
      fontSize: theme.spacing(2.5)
    }
  },
  marTp: {
    marginTop: 10,
  }
}));


const ViewProject = ({ history, location }) => {

  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const [refreshTable, setRefreshTable] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, data: null, title: '' });
  const [anchorElList, setAnchorElList] = useState([]);
  const selectedProject = location.state?.data?.project;

  const setAnchorElement = (e, index) => {
    e.stopPropagation();
    let newAnchorElList = [...anchorElList];
    newAnchorElList[index] = e.currentTarget;
    setAnchorElList(newAnchorElList);
  };

  const clearAnchorElement = (index) => {
    let newAnchorElList = [...anchorElList];
    newAnchorElList[index] = null;
    setAnchorElList(newAnchorElList);
  };

  const renderActions = (row) => (<>
    <SvgIcon component={MoreIcon} className={classes.moreBtn} onClick={e => setAnchorElement(e, row.id)} />
    <Menu
      anchorEl={anchorElList[row.id]}
      keepMounted
      open={Boolean(anchorElList[row.id])}
      onClose={() => clearAnchorElement(row.id)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <MenuItem onClick={() => editHandler(row.id)} className={classes.actionIcon}>
        <EditIcon color={"action"} /> Edit
      </MenuItem>
      <MenuItem onClick={() => openConfirmModal(row.id)} className={classes.actionIcon}>
        <DeleteIcon color={"action"} /> Delete
      </MenuItem>
      <MenuItem onClick={() => viewHandler(row.id)} className={classes.actionIcon}>
        <ViewIcon color={"action"} /> View
      </MenuItem>
    </Menu>
  </>);



  const getProjectList = () => new Promise(async (resolve) => {
    const params = { page_no: 1 };

    try {
      const res = await requestHandler(getProjects(params));
      const data = res.data;
      const count = res.meta.pagination.count;
      setAnchorElList(createArray(data.length));
      resolve({ data, count });
    } catch (e) {
      console.error(e);
      setAnchorElList([]);
      resolve({ data: [], count: 0 });
    }
  });

  const openConfirmModal = (data) => {
    clearAnchorElement(data);
    setConfirmModal({
      ...confirmModal, open: true, data,
      title: `Do you want to delete Organization?`
    });
  };

  const closeConfirmModal = async (isConfirm) => {
    setConfirmModal({ ...confirmModal, open: false });
    if (isConfirm) {
      await deleteHandler(confirmModal.data);
    }
  };

  const onAddClick = () => history.push(`/project/new`, { data: { action: 'Add', project: new Project() } });

  const editHandler = async (id) => {
    clearAnchorElement(id);
    try {
      const res = await requestHandler(getProject(id), { loader: true });
      history.push(`/project/edit`, { data: { action: 'Edit', project: new Project(res.data) } });
    } catch (e) {
      notify({ msg: 'Not able to get selected project. Something went wrong!!', type: 'error' });
    }
  };

  const viewHandler = async (id) => {
    clearAnchorElement(id);
    try {
      const res = await requestHandler(getProject(id), { loader: true });
      history.push(`/project/view`, { project: new Project(res.data) });
    } catch (e) {
      notify({ msg: 'Not able to get selected project. Something went wrong!!', type: 'error' });
    }
  };

  const deleteHandler = async (id) => {
    try {
      await requestHandler(deleteProject(id), { loader: true });
      notify({ msg: 'project has been deleted successfully.', type: 'success' });
      setRefreshTable(true);
      setTimeout(() => {
        setRefreshTable(false)
      });
    } catch (e) {
      notify({ msg: 'Not able to delete selected Organization. Something went wrong!!', type: 'error' });
    }
  };


  return (
    <Container title="Manage Projects" >
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Panel title="Projects" actions={
            <Button variant="contained" color="primary" onClick={() => history.push('/project/new')}>
            Create Project
          </Button>
          }>
            <Grid container spacing={2} alignItems={"center"} className={cx(classes.marTp)}>
              <Grid item xs={12}>
                <IndexTable
                  columns={[
                    {
                      name: 'actions', header: '', defaultWidth: 60, textAlign: 'center',
                      render: ({ data }) => renderActions(data)
                    },
                    ...ProjectSchema.columns
                  ]}
                  defaultFilterValue={ProjectSchema.filter}
                  loadData={getProjectList}
                />
              </Grid>
            </Grid>
          </Panel>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ViewProject