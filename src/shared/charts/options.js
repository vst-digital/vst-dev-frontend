import palette from "../../assets/muiTheme/palette";
import {colors} from "@material-ui/core";

const tooltips = () => {
    return {
        enabled: true,
        mode: 'index',
        intersect: false,
        borderWidth: 1,
        borderColor: palette.divider,
        backgroundColor: colors.common.white,
        titleFontColor: palette.text.primary,
        bodyFontColor: palette.text.secondary,
        footerFontColor: palette.text.secondary
    };
};

const getHorizontalAxis = (stacked = false) => {
    return [
        {
            stacked: stacked,
            barThickness: 12,
            maxBarThickness: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            ticks: {fontColor: palette.text.secondary},
            gridLines: {
                display: false,
                drawBorder: false
            }
        }
    ];
};

const getVerticalAxis = (stacked = false) => {
    return [
        {
            stacked: stacked,
            ticks: {
                fontColor: palette.text.secondary,
                beginAtZero: true,
                min: 0
            },
            gridLines: {
                borderDash: [7],
                borderDashOffset: [7],
                color: palette.divider,
                drawBorder: false,
                zeroLineBorderDash: [7],
                zeroLineBorderDashOffset: [7],
                zeroLineColor: palette.divider
            }
        }
    ]
}

const getBarOptions = (legendConfig) => {
    const {display = true, position = 'bottom'} = legendConfig || {};
    return {
        legend: {display, position},
        tooltips: tooltips(),
        scales: {
            xAxes: getHorizontalAxis(),
            yAxes: getVerticalAxis()
        }
    };
};

const getHorizontalBarOptions = (legendConfig) => {
    const {display = false, position = 'bottom'} = legendConfig || {};
    return {
        legend: {display, position},
        tooltips: tooltips(),
        scales: {
            xAxes: getVerticalAxis(),
            yAxes: getHorizontalAxis()
        }
    };
};

export const CHART_TYPE = {
    BAR: 'BAR',
    HORIZONTAL_BAR: 'HORIZONTAL_BAR'
};

export const getOptions = (type, config) => {
    const {legend} = config || {};
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        cornerRadius: 20,
    };
    switch (type) {
        case CHART_TYPE.BAR: {
            return {...commonOptions, ...getBarOptions(legend)};
        }
        case CHART_TYPE.HORIZONTAL_BAR: {
            return {...commonOptions, ...getHorizontalBarOptions(legend)};
        }
        default: {
            return commonOptions;
        }
    }
};
