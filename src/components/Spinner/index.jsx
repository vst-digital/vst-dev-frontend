import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.spinner,
        color: '#fff',
    },
}));

const Spinner = ({open}) => {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit"/>
        </Backdrop>
    );
};

export default Spinner;
