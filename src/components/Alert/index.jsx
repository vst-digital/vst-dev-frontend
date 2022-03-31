import {useEffect, useState, forwardRef} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '21px',
        letterSpacing: '-0.05px'
    }
}));

const Alert = forwardRef((
    {
        show = false,
        type = 'info',
        variant = 'standard',
        message = '',
        closable,
        onClose,
        onAutoHide,
        autoHideDuration = 5000,
        ...props
    }, ref
) => {
    const classes = useStyles();
    const [defaultShow, setDefaultShow] = useState(true);

    useEffect(() => {
        setDefaultShow(true);
        if(onAutoHide) {
            setTimeout(() => onAutoHide(), autoHideDuration);
        }
    }, [show]);

    return (
        (defaultShow && show) ? <MuiAlert
            ref={ref}
            className={classes.root}
            variant={variant}
            severity={type}
            onClose={closable ? (onClose ? onClose : () => setDefaultShow(false)) : null}
        >
            {message}
        </MuiAlert> : null
    );
})
export default Alert;
