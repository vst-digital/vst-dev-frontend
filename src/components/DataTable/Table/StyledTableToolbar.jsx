import PropTypes from 'prop-types';
import cn from 'classnames';
import {IconButton, lighten, makeStyles, SvgIcon, Toolbar, Tooltip, Typography} from '@material-ui/core';
import DeleteRounded from '@material-ui/icons/DeleteRounded';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        borderRadius: 4
    },
    highlight: {
        backgroundColor: lighten(theme.palette.secondary.light, 0.92),
    },
    title: {flex: '1 1 100%'},
    actionButton: {
        margin: theme.spacing(1),
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}));

const StyledTableToolbar = (props) => {
    const {title, numSelected, actions} = props;
    const classes = useToolbarStyles();

    const createActions = () => actions.map(action => (
        <Tooltip key={`${action.id}-${Date.now()}`} title={action.tooltip}>
            <SvgIcon className={classes.actionButton} component={action.icon}/>
        </Tooltip>
    ));

    return (
        <Toolbar className={cn(classes.root, {[classes.highlight]: numSelected > 0})}>
            {numSelected > 0 ?
                <Typography className={classes.title} variant="subtitle1">{numSelected} row(s) selected</Typography> :
                <Typography className={classes.title} variant="h4">{title}</Typography>
            }
            {numSelected > 0 ?
                <Tooltip title="Delete"><IconButton><DeleteRounded/></IconButton></Tooltip> :
                createActions()
            }
        </Toolbar>
    );
};

StyledTableToolbar.propTypes = {
    title: PropTypes.string,
    numSelected: PropTypes.number.isRequired,
    actions: PropTypes.array.isRequired
};

StyledTableToolbar.defaultProps = {
    numSelected: 0,
    actions: []
};

export default StyledTableToolbar;
