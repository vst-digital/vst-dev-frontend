import {Avatar, Card, CardContent, Grid, LinearProgress, makeStyles, Typography} from '@material-ui/core';
import InsertChartRounded from '@material-ui/icons/InsertChartRounded';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        boxShadow: theme.shadows[2]
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 700
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    progress: {
        marginTop: theme.spacing(3)
    }
}));

export default props => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography className={classes.title} color="textSecondary" gutterBottom variant="body2">
                            TASKS PROGRESS
                        </Typography>
                        <Typography variant="h3">75.5%</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <InsertChartRounded className={classes.icon}/>
                        </Avatar>
                    </Grid>
                </Grid>
                <LinearProgress className={classes.progress} value={75.5} variant="determinate"/>
            </CardContent>
        </Card>
    );
};
