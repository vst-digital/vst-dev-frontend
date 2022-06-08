import { Fragment, useLayoutEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Collapse, colors, Drawer, List, ListItem, makeStyles, SvgIcon, Typography } from "@material-ui/core";
import {
    ArrowDropDown,
    ArrowDropUp,
    Category, 
} from "@material-ui/icons";
import { adminList, siteOwnerList, memberList } from "./navLists"
import cn from "classnames";
import Scrollbar from "react-custom-scrollbars-2";
import { computeHeight, getInitials } from "../../../../shared/utilities/common.util";

var navList = [...memberList];

const role = localStorage.getItem("role");
 if ( role === "site_owner" ){ navList = [...memberList, ...siteOwnerList] }
 else if ( role === "project_admin" ){ navList = [...memberList, ...adminList] }
        
const useStyles = makeStyles((theme) => ({
    flexGrow: { flexGrow: 1 },
    drawer: {
        width: 260,
        flexShrink: 0,
        whiteSpace: "nowrap"
    },
    drawerOpen: {
        width: 260,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing(10)
    },
    drawerPaper: {
        color: colors.common.white,
        backgroundColor: colors.common.black,
        opacity: 0.8,
        boxShadow: theme.shadows[4]
    },
    toolbar: {
        ...theme.mixins.toolbar,
        display: 'flex',
        alignItems: 'center',
        width: 'auto',
        margin: theme.spacing(0, 2),
        padding: theme.spacing(1.25),
        borderBottom: `1px solid ${theme.palette.grey[200]}`
    },
    toolbarTitle: {
        color: colors.common.white,
        fontWeight: 500
    },
    navList: {
        paddingBottom: theme.spacing(4)
    },
    navItem: {
        color: 'inherit',
        margin: 0,
        padding: 0,
        display: 'block',
        position: 'relative',
        textDecoration: 'none'
    },
    navIcon: {
        width: theme.spacing(4),
        height: theme.spacing(3),
        textAlign: 'center',
        marginRight: theme.spacing(2)
    },
    navTextIcon: {
        lineHeight: "32px",
        color: "inherit",
        minWidth: theme.spacing(4),
        textAlign: 'center',
        marginRight: theme.spacing(2)
    },
    navText: {
        lineHeight: "32px",
        color: "inherit"
    },
    hideText: {
        opacity: 0
    },
    link: {
        display: "flex",
        alignItems: "center",
        width: "auto",
        margin: theme.spacing(1.25, 1.875, 0),
        padding: theme.spacing(1.25),
        borderRadius: 3,
        color: "inherit",
        "&:hover": {
            outline: 'none',
            backgroundColor: `rgba(200, 200, 200, .2)`
        }
    },
    linkActive: {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: `0 12px 20px -10px rgba(26, 35, 126, .28), 0 4px 20px 0 rgba(26, 35, 126, .12), 0 7px 8px -5px rgba(26, 35, 126, .2)`,
        "&:hover": {
            outline: 'none',
            backgroundColor: theme.palette.primary.dark
        }
    }
}));

const Sidebar = ({ openSidebar }) => {
    const classes = useStyles();
    const [contentHeight, setContentHeight] = useState(computeHeight(64));
    const [collapseState, setCollapseState] = useState({
        inspection: false,
        maintenance: false,
        toolMgmt: false
    });

    useLayoutEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => setTimeout(() => setContentHeight(computeHeight(64)), 500);

    const handleSubMenuClick = menuId => {
        setCollapseState({
            ...collapseState,
            [menuId]: !collapseState[menuId]
        });
    };
            
    const getSidebarNav = (navList, isSubList = false, parentIndex = '') => {
        return (
            <List component="ul" disablePadding className={cn({ [classes.navList]: !isSubList })}>
                {navList.map((page, index) => {
                    const key = `${parentIndex}${index}-sidebarNav-${page.id}`;
                    const isSubMenu = !!page.subMenu;
                    let navItem;

                    if (isSubMenu) {
                        navItem = (
                            <Fragment key={key}>
                                <ListItem
                                    component={"li"}
                                    className={classes.navItem}
                                    onClick={() => handleSubMenuClick(page.id)}
                                >
                                    <div className={classes.link}>
                                        {page.icon && <SvgIcon className={classes.navIcon} component={page.icon} />}
                                        <Typography
                                            className={cn(classes.navText, { [classes.hideText]: !openSidebar })}
                                            variant="subtitle1"
                                        >
                                            {page.label}
                                        </Typography>
                                        <div className={classes.flexGrow} />
                                        {collapseState[page.id] ? <ArrowDropUp /> : <ArrowDropDown />}
                                    </div>
                                </ListItem>
                                <Collapse in={collapseState[page.id]} timeout="auto" unmountOnExit>
                                    {getSidebarNav(page.subMenu, true, `${index}-`)}
                                </Collapse>
                            </Fragment>
                        );
                    } else {
                        navItem = <ListItem key={key} component={"li"} className={classes.navItem}>
                            <NavLink className={classes.link} to={page.path} activeClassName={classes.linkActive}>
                                {page.icon ?
                                    <SvgIcon className={classes.navIcon} component={page.icon} /> :
                                    <span className={classes.navTextIcon}>{getInitials(page.label)}</span>
                                }
                                <Typography
                                    variant="subtitle1"
                                    className={cn(classes.navText, {
                                        [classes.hideText]: !openSidebar
                                    })}
                                >
                                    {page.label}
                                </Typography>
                            </NavLink>
                        </ListItem>;
                    }
                    return navItem;
                })}
            </List>
        );
    };

    return (
        <Drawer
            variant="permanent"
            className={cn(classes.drawer, { [classes.drawerOpen]: openSidebar, [classes.drawerClose]: !openSidebar })}
            classes={{
                paper: cn(classes.drawerPaper, {
                    [classes.drawerOpen]: openSidebar,
                    [classes.drawerClose]: !openSidebar
                })
            }}
        >
            <div className={classes.toolbar}>
                <SvgIcon className={classes.navIcon} component={Category} />
                <Typography variant={"h6"} className={cn(classes.toolbarTitle, { [classes.hideText]: !openSidebar })}>
                    VST Project Manage
                </Typography>
            </div>
            <Scrollbar
                autoHide
                autoHeight
                autoHeightMin={0}
                autoHeightMax={contentHeight}
                renderTrackHorizontal={(props) => (<div {...props} style={{ display: "none" }} />)}
                renderThumbHorizontal={(props) => (<div {...props} style={{ display: "none" }} />)}
            >
                {navList && getSidebarNav(navList)}
            </Scrollbar>
        </Drawer>
    );
};

export default Sidebar;
