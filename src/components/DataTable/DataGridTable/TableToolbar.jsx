import PropTypes from 'prop-types';
import {makeStyles, SvgIcon, Toolbar, Tooltip, Typography} from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        borderRadius: 4
    },
    title: {flex: '1 1 100%'},
    actionButton: {
        margin: theme.spacing(1),
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}));

const TableToolbar = (props) => {
    const {title, actions} = props;
    const classes = useStyle();

    const createActions = () => actions.map(action => (
        <Tooltip key={`${action.id}-${Date.now()}`} title={action.tooltip}>
            <SvgIcon className={classes.actionButton} component={action.icon}/>
        </Tooltip>
    ));

    return (
        <Toolbar className={classes.root}>
            <Typography className={classes.title} variant="h4">{title}</Typography>
            {createActions()}
        </Toolbar>
    );
};

TableToolbar.propTypes = {
    title: PropTypes.string,
    actions: PropTypes.array
};

TableToolbar.defaultProps = {
    actions: []
};

export default TableToolbar;
