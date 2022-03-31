import { Container, Panel, InlineTable } from "components";
import Grid from "@material-ui/core/Grid";
import { Box, Button, Card, CardActions, CardContent, makeStyles, Menu, MenuItem, SvgIcon, Typography } from "@material-ui/core";
import cx from 'clsx';
import AddGroup from "pages/Project/modals/AddGroup"


const viewProject = ({ history, location }) => {
  const selectProject = location.state.project;

  return (
    <Container title="Manage Project">
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Panel title={selectProject.title} actions={<AddGroup history={history} location={location} />}>
            <Grid container spacing={2} alignItems={"center"} >
              <Grid item xs={12}>
                <Typography variant={"h6"}>Project Status: {selectProject.status}</Typography>
                <Typography variant={"h6"}>Project Description: {selectProject.project_description}</Typography>
              </Grid>
            </Grid>
          </Panel>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems={"center"} >
        <Grid item xs={12}>
          <Panel title="Groups">
            <InlineTable
              id={'groups'} toolbar={false} dense
              schema={[
                { id: 'id', label: '#', render: (_, i) => (i + 1) },
                { id: 'name', label: 'Name', render: row => row.name },
                { id: 'description', label: 'description', render: row => row.description },
              ]}
              data={selectProject.groups}
            />
          </Panel>
        </Grid>
      </Grid>
    </Container>
  )
}

export default viewProject;