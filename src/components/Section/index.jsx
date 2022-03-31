import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1, 1.5),
        backgroundColor: theme.palette.grey[200]
    },
    title: {flex: '1 1 100%'},
    action: {marginRight: theme.spacing(1)}
}));

const Section = ({title, heading = 'h5', dense = true, children}) => {
    const classes = useStyles();

    return (
        <Toolbar className={classes.root} variant={dense ? 'dense' : 'regular'}>
            <Typography className={classes.title} variant={heading}>{title}</Typography>
            {children}
        </Toolbar>
    );
};

export default Section;
