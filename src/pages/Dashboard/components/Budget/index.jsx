import {Avatar, Card, CardContent, Grid, makeStyles, Typography} from '@material-ui/core';
import {ArrowDownwardRounded, MoneyRounded} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        boxShadow: theme.shadows[2]
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {fontWeight: 700},
    avatar: {
        backgroundColor: theme.palette.error.main,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    differenceIcon: {
        color: theme.palette.error.dark
    },
    differenceValue: {
        color: theme.palette.error.dark,
        marginRight: theme.spacing(1)
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
                            BUDGET
                        </Typography>
                        <Typography variant="h3">$24,000</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <MoneyRounded className={classes.icon}/>
                        </Avatar>
                    </Grid>
                </Grid>
                <div className={classes.difference}>
                    <ArrowDownwardRounded className={classes.differenceIcon}/>
                    <Typography className={classes.differenceValue} variant="body2">12%</Typography>
                    <Typography className={classes.caption} variant="caption">Since last month</Typography>
                </div>
            </CardContent>
        </Card>
    );
};
