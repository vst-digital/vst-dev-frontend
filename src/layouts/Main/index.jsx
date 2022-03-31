import {useEffect, useLayoutEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Scrollbar from "react-custom-scrollbars-2";

import {computeHeight, computeWidth} from "../../shared/utilities/common.util";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const useStyles = makeStyles((theme) => ({
    root: {display: "flex"},
    flexGrow: {flexGrow: 1},
    toolbar: {...theme.mixins.toolbar},
    content: {
        margin: theme.spacing(3),
        height: "100%"
    }
}));

const Main = (props) => {
    const classes = useStyles();
    const [openSidebar, setOpenSidebar] = useState(true);
    const [contentHeight, setContentHeight] = useState(computeHeight(64));
    const [contentWidth, setContentWidth] = useState(computeWidth(260));

    useEffect(() => {
        setContentWidth(computeWidth(openSidebar ? 260 : 80));
    }, [openSidebar]);

    useLayoutEffect(() => {
        const handleResize = () => {
            setContentHeight(computeHeight(64));
            setContentWidth(computeWidth(openSidebar ? 260 : 80));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [openSidebar]);

    return <div className={classes.root}>
        <Header handlerSidebarAction={() => setOpenSidebar(!openSidebar)} openSidebar={openSidebar}/>
        <Sidebar openSidebar={openSidebar}/>

        <div className={classes.flexGrow}>
            <div className={classes.toolbar}/>
            <Scrollbar
                autoHide autoHeight
                autoHeightMin={0}
                autoHeightMax={contentHeight}
                style={{width: `${contentWidth}px`}}
            >
                <div className={classes.content}>{props.children}</div>
            </Scrollbar>
        </div>
    </div>;
};

export default Main;
