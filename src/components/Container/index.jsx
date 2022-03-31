import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";

const useStyle = makeStyles(theme => ({
    title: {margin: theme.spacing(.5, 0)},
    actions: {
        '& > :not(:last-child)': {
            marginRight: theme.spacing(2)
        }
    },
    paper: {padding: theme.spacing(2)}
}));

const Container = ({title, actions, paper, ...props}) => {
    const classes = useStyle();

    return (
        <Grid container spacing={2}>
            {(title || actions) &&
            <Grid item xs={12} container spacing={0} justifyContent={"space-between"} alignItems={"center"}>
                <Grid item>
                    <Typography className={classes.title} variant={"h3"}>{title}</Typography>
                </Grid>
                <Grid item className={classes.actions}>{actions}</Grid>
            </Grid>}
            <Grid item xs={12}>
                {paper && <Paper elevation={2} className={classes.paper}>
                    {props.children}
                </Paper>}
                {!paper && props.children}
            </Grid>
        </Grid>
    );
};

export default Container;
