import * as React from "react";
import { useState } from "react";
import { useHttp } from "hooks";
import cx from 'clsx';
import { createArray } from "shared/utilities/common.util";
import { getGroups, getGroup, postGroup, putGroup, deleteGroup } from "shared/services";
import { GroupSchema } from "shared/utilities/dataGridSchema";
import { Button, makeStyles, Menu, MenuItem, SvgIcon } from "@material-ui/core";
import { Container, IndexTable, ConfirmModal } from "components";
import ViewIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import { Group } from "shared/models";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreIcon from "@material-ui/icons/MoreVert";


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


const ViewAllGroup = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const [refreshTable, setRefreshTable] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, data: null, title: '' });
  const [anchorElList, setAnchorElList] = useState([]);
  const selectedOrganization = location.state?.data?.organization;

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

  const openConfirmModal = (data) => {
    clearAnchorElement(data);
    setConfirmModal({
      ...confirmModal, open: true, data,
      title: `Do you want to delete Group?`
    });
  };

  const closeConfirmModal = async (isConfirm) => {
    setConfirmModal({ ...confirmModal, open: false });
    if (isConfirm) {
      await deleteHandler(confirmModal.data);
    }
  };

  // const onAddClick = () => history.push(`/project/new`, { data: { action: 'Add', project: new Project() } });

  const editHandler = async (id) => {
    clearAnchorElement(id);
    try {
      const res = await requestHandler(getGroup(id), { loader: true });
      history.push(`/group/edit`, { data: { action: 'Edit', group: new Group(res.data) } });
    } catch (e) {
      notify({ msg: 'Not able to get selected group. Something went wrong!!', type: 'error' });
    }
  };

  const viewHandler = async (id) => {
    clearAnchorElement(id);
    try {
      const res = await requestHandler(getGroup(id), { loader: true });
      history.push(`/group/view`, { group: new Group(res.data) });
    } catch (e) {
      notify({ msg: 'Not able to get selected group. Something went wrong!!', type: 'error' });
    }
  };

  const deleteHandler = async (id) => {
    try {
      await requestHandler(deleteGroup(id), { loader: true });
      notify({ msg: 'group has been deleted successfully.', type: 'success' });
      setRefreshTable(true);
      setTimeout(() => {
        setRefreshTable(false)
      });
    } catch (e) {
      notify({ msg: 'Not able to delete selected Organization. Something went wrong!!', type: 'error' });
    }
  };

  const getGroupList = () => new Promise(async (resolve) => {
    const params = { page_no: 1 };
    try {
      const res = await requestHandler(getGroups(params));
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

  return (
    <Container title="Manage Groups" actions={
      <Button variant="contained" color="primary" onClick={() => history.push('/group/new')}>
        Create Group
      </Button>
    }>
      <ConfirmModal
        title={confirmModal.title}
        open={confirmModal.open}
        close={closeConfirmModal}
      />
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems={"center"} className={cx(classes.marTp)}>
            <Grid item xs={12}>
              <IndexTable
                columns={[
                  {
                    name: 'actions', header: '', defaultWidth: 60, textAlign: 'center',
                    render: ({ data }) => renderActions(data)
                  },
                  ...GroupSchema.columns
                ]}
                defaultFilterValue={GroupSchema.filter}
                loadData={getGroupList}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ViewAllGroup