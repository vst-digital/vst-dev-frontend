import {Bar} from 'react-chartjs-2';
import {Button, Card, CardActions, CardContent, CardHeader, Divider, makeStyles} from '@material-ui/core';
import {ArrowDropDown, ArrowRight} from '@material-ui/icons';

import palette from "assets/muiTheme/palette";
import {CHART_TYPE, getOptions} from "shared/charts/options";

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: theme.shadows[2]
    },
    chartContainer: {
        height: 400,
        position: 'relative'
    },
    actions: {
        justifyContent: 'flex-end'
    }
}));

const DATA = {
    labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug'],
    datasets: [
        {
            label: 'This year',
            backgroundColor: palette.primary.main,
            data: [18, 5, 19, 27, 29, 19, 20]
        },
        {
            label: 'Last year',
            backgroundColor: palette.neutral,
            data: [11, 20, 12, 29, 30, 25, 13]
        }
    ]
};

const LatestSales = () => {
    const classes = useStyles();

    return (
        <Card elevation={2}>
            <CardHeader
                action={
                    <Button size="small" variant="text">
                        Last 7 days <ArrowDropDown/>
                    </Button>
                }
                title="Latest Sales"
            />
            <Divider/>
            <CardContent>
                <div className={classes.chartContainer}>
                    <Bar data={DATA} options={getOptions(CHART_TYPE.BAR)}/>
                </div>
            </CardContent>
            <Divider/>
            <CardActions className={classes.actions}>
                <Button color="primary" size="small" variant="text">
                    Overview <ArrowRight/>
                </Button>
            </CardActions>
        </Card>
    );
};

export default LatestSales;
