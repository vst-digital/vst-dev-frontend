import {Avatar, Card, CardContent, Grid, makeStyles, Typography} from '@material-ui/core';
import AttachMoneyRounded from '@material-ui/icons/AttachMoneyRounded';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
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
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.main,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    }
}));

export default props => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography className={classes.title} color="inherit" gutterBottom variant="body2">
                            TOTAL PROFIT
                        </Typography>
                        <Typography color="inherit" variant="h3">$23,200</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <AttachMoneyRounded className={classes.icon}/>
                        </Avatar>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
