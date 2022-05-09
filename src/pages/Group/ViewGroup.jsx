import * as React from "react";
import { useState } from "react";
import { useHttp } from "hooks";

import { Container, Panel, InlineTable } from "components";
import Grid from "@material-ui/core/Grid";
import { Typography, Button, IconButton } from "@material-ui/core";
import cx from 'clsx';
import AddGroupMember from "pages/Group/modal/AddGroupMember";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { postGroupMemberRemove } from "shared/services";

const ViewGroup = ({ history, location }) => {
  const [refreshTable, setRefreshTable] = useState(false);
  const { notify, requestHandler } = useHttp();

  const selectedGroup = location.state?.group;

  const getRowActions = (name, row, i) => (<>
    <IconButton onClick={() => deleteHandler(row)}><DeleteIcon /></IconButton>
  </>);

  const deleteHandler = async (row) => {
    try {
      const data = {"user_id":row.id }
      await requestHandler(postGroupMemberRemove(selectedGroup.id, data), { loader: true });
      notify({ msg: 'User has been removed successfully.', type: 'success' });
      history.push('/groups')
    } catch (e) {
      notify({ msg: 'Not able to delete selected User. Something went wrong!!', type: 'error' });
    }
  };

  return (
    <Container title="View Group">
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Panel title={selectedGroup.name} actions={
            <AddGroupMember history={history} location={location} />
          }>
            <Grid container spacing={2} alignItems={"center"} >
              <Grid item xs={12}>
                <Typography variant={"h6"}>Group Name: {selectedGroup.name}</Typography>
                <Typography variant={"h6"}>Description: {selectedGroup.description}</Typography>
              </Grid>
            </Grid>
          </Panel>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems={"center"} >
        <Grid item xs={12}>
          <Panel title="Members">
            { !refreshTable && <InlineTable
              id={'members'} toolbar={false} dense
              actions={[{ id: 'add', label: 'Add', action: () => "" }]}
              schema={[
                { id: 'id', label: '#', render: (_, i) => (i + 1) },
                { id: 'name', label: 'Name', render: row => row.first_name },
                { id: 'email', label: 'Email', render: row => row.email },
                { id: 'role', label: 'Role', render: row => row.role },
                { id: 'created_at', label: 'Created At', render: row => row.created_at },
                { id: 'actions', render: (row, i) => getRowActions("", row, i) }
              ]}
              data={selectedGroup.users}
            /> }
          </Panel>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ViewGroup;