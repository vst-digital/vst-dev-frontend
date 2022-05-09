import { Avatar, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { AccountTree } from '@material-ui/icons';
import { Button } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        boxShadow: theme.shadows[2]
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: { fontWeight: 700 },
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

const ProjectInformation = ({ history, location }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography className={classes.title} variant="h4" color="textSecondary" gutterBottom >
                            Project Information
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <AccountTree className={classes.icon} />
                        </Avatar>
                    </Grid>
                </Grid>
                <div className={classes.difference}>
                    <Button variant="outlined" color="primary" size="large" onClick={() => history.push('/projectInformation')}>Project Information</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectInformation;