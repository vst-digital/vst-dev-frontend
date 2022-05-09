import * as React from "react";
import { useState } from "react";
import { useHttp } from "hooks";
import cx from 'clsx';
import { createArray } from "shared/utilities/common.util";
import { getMembers, getOrganization, postMemberInvite, deleteOrganization } from "shared/services";
import { MemberSchema } from "shared/utilities/dataGridSchema";
import { Box, Button, Card, CardActions, CardContent, makeStyles, Menu, MenuItem, SvgIcon, Typography } from "@material-ui/core";
import { Container, DisplayField, InlineTable, Panel, RowDivider, IndexTable } from "components";
import ViewIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";

import AddMember from "./modal/AddMember";

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


const ViewOrganization = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const [refreshTable, setRefreshTable] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, data: null, title: '' });
  const [anchorElList, setAnchorElList] = useState([]);
  const [organizationDetails, setOrganizationDetails] = useState([]);
  const selectedOrganization = location.state?.data?.organization;

  const renderActions = (row) => (<>
  </>);

  const getMembersList = () => new Promise(async (resolve) => {
    const params = { page_no: 1 };
    try {
      const res = await requestHandler(getMembers(params));
      const data = res.data;
      const count = res.meta.pagination.count;
      setOrganizationDetails(data)
      setAnchorElList(createArray(data.length));
      resolve({ data, count });
    } catch (e) {
      console.error(e);
      setAnchorElList([]);
      resolve({ data: [], count: 0 });
    }
  });

  return (
    <Container title="Manage Members" >
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Panel title="Members" actions={
            <AddMember history={history}/>
          }>
            {/* <Grid item xs={2}>
              <Card sx={{ minWidth: 700 }} className={classes.cardPd}>
                <CardContent>
                  <Typography variant="h5" color="primery" gutterBottom>
                    Name: {organizationDetails.length > 0 ? organizationDetails[0].name : "Organization Name"}
                  </Typography>
                  <Typography variant="h6" component="div">
                    Contact: {organizationDetails.length > 0 ? organizationDetails[0].phone : "Organization Phone"}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="textSecondary">
                    Address: {organizationDetails.length > 0 ? organizationDetails[0].address : "Organization Address"}
                  </Typography>
                  <Typography variant="body2">
                    Description: {organizationDetails.length > 0 ? organizationDetails[0].description : "Organization Description"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" fullWidth variant="outlined" onClick={() => history.push('/organization/edit')} >Edit Details</Button>
                </CardActions>
              </Card>
            </Grid> */}
                <IndexTable
                  columns={[
                    {
                      name: 'actions', header: '', defaultWidth: 60, textAlign: 'center',
                      render: ({ data }) => renderActions(data)
                    },
                    ...MemberSchema.columns
                  ]}
                  defaultFilterValue={MemberSchema.filter}
                  loadData={getMembersList}
                />
          </Panel>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ViewOrganization