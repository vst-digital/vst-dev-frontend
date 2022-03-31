import {colors} from "@material-ui/core";

const palette = {
    background: {
        default: '#F4F6F8',
        paper: colors.common.white
    },
    primary: {
        contrastText: colors.common.white,
        dark: '#19257E',
        main: '#3F52B5',
        light: '#7987CB'
    },
    secondary: {
        contrastText: colors.common.white,
        dark: colors.pink[900],
        main: colors.pink['500'],
        light: colors.pink['100']
    },
    text: {
        primary: '#555e68',
        secondary: '#8993A0',
        link: colors.blue[600]
    },
    divider: colors.grey[200]
};

export default palette;
