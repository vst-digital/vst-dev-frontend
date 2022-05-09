import * as React from 'react';
import { useHttp } from "hooks";
import { useState, useEffect } from "react";
import { Button, Chip, Drawer, Typography, makeStyles, Toolbar, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar, styled, Badge } from "@material-ui/core";
import ChatIcon from '@material-ui/icons/Chat';
import { getMembers } from "shared/services";

const useStyles = makeStyles((theme) => ({
  messaging: {
    margin: "1%",
    bottom: 0,
    right: 0,
    position: 'fixed',
    cursor: "pointer",
    color: 'white',
    backgroundColor: '#454f97'
  },
  chipStyle: {
    marginRight: '4%'
  },
  DrawerStyle: {
    width: '15%',
    color: 'black'
  }
}));

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: '#44b700',
//     color: '#44b700',
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     '&::after': {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       animation: 'ripple 1.2s infinite ease-in-out',
//       border: '1px solid currentColor',
//       content: '""',
//     },
//   },
//   '@keyframes ripple': {
//     '0%': {
//       transform: 'scale(.8)',
//       opacity: 1,
//     },
//     '100%': {
//       transform: 'scale(2.4)',
//       opacity: 0,
//     },
//   },
// }));


const ChatModule = ({ history, location }) => {
  const classes = useStyles();
  const { notify, requestHandler } = useHttp();
  const [groupMembers, setGroupMembers] = useState([]);
  const [preview, setPreview] = useState(false);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    setTimeout(() => new Promise(async (resolve) => {
      try {
        const limit = 50
        const per_page = limit;
        const page_no = 1;
        const filter = {};
        const sort = '';
        const res = await requestHandler(getMembers({ per_page, page_no, sort, filter }));
        const data = res.data;
        const count = res.meta.pagination.count;
        resolve(setGroupMembers(data));
        setPreview(true);
      } catch (e) {
        console.error(e);
        setGroupMembers({ data: [], count: 0 });
        resolve({ data: [], count: 0 });
      }
    }), 1000)
  }, []);

  return (
    <>
      <Button variant="contained" className={classes.messaging} endIcon={<ChatIcon />} onClick={toggleDrawer('right', true)}><Avatar src="/static/images/avatar/1.jpg" className={classes.chipStyle}>{localStorage.getItem('initials')}</Avatar>Messaging</Button>
      <Drawer
        anchor={'right'}
        open={state['right']}
        className={classes.DrawerStyle}
        onClose={toggleDrawer('right', false)}
        classes={{ paper: classes.DrawerStyle }}
      >
        <div>
          <Toolbar><Typography variant="h5">Group Members</Typography></Toolbar>
          <Divider />
          <List>
            {console.log(groupMembers)}
            {preview && groupMembers.map((member) => (
              <ListItem button key={member.first_name}>
                <ListItemIcon>
                  <Avatar src="/static/images/avatar/1.jpg" >{member.initials}</Avatar>
                </ListItemIcon>
                <ListItemText primary={member.first_name} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </div>
      </Drawer>
    </>
  )
}

export default ChatModule;