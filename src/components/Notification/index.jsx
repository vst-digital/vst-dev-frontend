import {forwardRef} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(() => ({
    root: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '21px',
        paddingRight: '20px'
    }
}));

const Notification = forwardRef((
    {
        show,
        autoHideDuration,
        originVertical,
        originHorizontal,
        type,
        variant,
        message,
        onClose,
        elevation = 6,
        ...props
    }, ref
) => {
    const classes = useStyles();

    return (
        <Snackbar
            ref={ref}
            open={show}
            anchorOrigin={{vertical: originVertical, horizontal: originHorizontal}}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
        >
            <Alert
                className={classes.root}
                elevation={elevation}
                variant={variant}
                severity={type}
                onClose={onClose}
            >
                {message}
            </Alert>
        </Snackbar>
    );
});

export default Notification;
