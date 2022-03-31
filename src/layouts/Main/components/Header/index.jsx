import {useState} from "react";
import {useDispatch} from 'react-redux';
import {withRouter} from "react-router-dom";
import cn from "classnames";
import {
    AppBar,
    Avatar,
    colors,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@material-ui/core";
import {
    AccountCircleRounded,
    MenuOpenRounded,
    MenuRounded as MenuIcon,
    PersonRounded,
    PowerSettingsNewRounded
} from "@material-ui/icons";

import {authLogout} from "store/actions/auth.actions";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.appBar,
        backgroundColor: colors.common.white,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: theme.spacing(10),
        width: `calc(100% - 80px)`
    },
    appBarShift: {
        marginLeft: 260,
        width: `calc(100% - 260px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    flexGrow: {flexGrow: 1},
    menuButton: {marginRight: 24},
    logo: {height: 32},
    avatar: {
        "&:hover": {cursor: "pointer"}
    },
    user: {
        padding: theme.spacing(0.75, 2),
        display: "flex",
        alignItems: "center",
    },
    userIcon: {color: "inherit"},
    userDetails: {paddingLeft: 16},
}));

const Header = ({handlerSidebarAction, openSidebar, ...props}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const logout = () => dispatch(authLogout());

    const [anchorEl, setAnchorEl] = useState(null);

    const profileClickHandler = () => {
        setAnchorEl(null);
        props.history.push("/settings");
    };

    const signOutHandler = () => {
        setAnchorEl(null);
        logout();
        props.history.push("/signIn");
    };

    return (
        <AppBar position="fixed" className={cn(classes.appBar, {[classes.appBarShift]: openSidebar})}>
            <Toolbar>
                <IconButton
                    edge="start"
                    onClick={handlerSidebarAction}
                    className={classes.menuButton}
                >
                    {!openSidebar ? <MenuIcon/> : <MenuOpenRounded/>}
                </IconButton>
                <div className={classes.flexGrow}/>
                <div>
                    <Avatar className={classes.avatar} onClick={e => setAnchorEl(e.currentTarget)}>TU</Avatar>
                    <Menu
                        id="avatar-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        getContentAnchorEl={null}
                        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                        transformOrigin={{vertical: "top", horizontal: "left"}}
                        PaperProps={{style: {width: 200, marginTop: 13}}}
                    >
                        <div className={classes.user}>
                            <Avatar className={classes.userIcon}>
                                <AccountCircleRounded/>
                            </Avatar>
                            <div className={classes.userDetails}>
                                <Typography variant="subtitle1">Toro User</Typography>
                            </div>
                        </div>
                        <Divider/>
                        <MenuItem onClick={profileClickHandler}>
                            <ListItemIcon><PersonRounded/></ListItemIcon>
                            <ListItemText primary="Profile"/>
                        </MenuItem>
                        <MenuItem onClick={signOutHandler}>
                            <ListItemIcon><PowerSettingsNewRounded/></ListItemIcon>
                            <ListItemText primary="Sign Out"/>
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(Header);
