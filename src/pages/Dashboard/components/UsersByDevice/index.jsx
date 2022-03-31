import {Doughnut} from 'react-chartjs-2';
import {Card, CardContent, CardHeader, Divider, IconButton, makeStyles, Typography, useTheme} from '@material-ui/core';
import {LaptopMacRounded, PhoneIphoneRounded, RefreshRounded, TabletMacRounded} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        boxShadow: theme.shadows[2]
    },
    chartContainer: {
        position: 'relative',
        height: '300px'
    },
    stats: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
    device: {
        textAlign: 'center',
        padding: theme.spacing(1)
    },
    deviceIcon: {
        color: theme.palette.icon
    }
}));

export default props => {
    const classes = useStyles();
    const theme = useTheme();

    const data = {
        datasets: [
            {
                data: [63, 15, 22],
                backgroundColor: [
                    theme.palette.primary.main,
                    theme.palette.error.main,
                    theme.palette.warning.main
                ],
                borderWidth: 8,
                borderColor: theme.palette.white,
                hoverBorderColor: theme.palette.white
            }
        ],
        labels: ['Desktop', 'Tablet', 'Mobile']
    };

    const options = {
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        cutoutPercentage: 80,
        layout: {padding: 0},
        tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            borderWidth: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.white,
            titleFontColor: theme.palette.text.primary,
            bodyFontColor: theme.palette.text.secondary,
            footerFontColor: theme.palette.text.secondary
        }
    };

    const devices = [
        {
            title: 'Desktop',
            value: '63',
            icon: <LaptopMacRounded/>,
            color: theme.palette.primary.main
        },
        {
            title: 'Tablet',
            value: '15',
            icon: <TabletMacRounded/>,
            color: theme.palette.error.main
        },
        {
            title: 'Mobile',
            value: '23',
            icon: <PhoneIphoneRounded/>,
            color: theme.palette.warning.main
        }
    ];

    return (
        <Card className={classes.root}>
            <CardHeader
                action={
                    <IconButton size="small"><RefreshRounded/></IconButton>
                }
                title="Users By Device"
            />
            <Divider/>
            <CardContent>
                <div className={classes.chartContainer}>
                    <Doughnut
                        data={data}
                        options={options}
                    />
                </div>
                <div className={classes.stats}>
                    {devices.map(device => (
                        <div className={classes.device} key={device.title}>
                            <span className={classes.deviceIcon}>{device.icon}</span>
                            <Typography variant="body1">{device.title}</Typography>
                            <Typography style={{color: device.color}} variant="h2">{device.value}%</Typography>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
