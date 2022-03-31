import PropTypes from 'prop-types';
import {makeStyles, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}));

const TableHeader = (props) => {
    const classes = useStyles();
    const {schema, order, orderBy, onSort} = props;

    const getAlignment = (headCell) => {
        return (headCell.id === 'actions' || headCell.type === 'number') ? 'right' : 'inherit';
    };

    const renderTableHead = () => (schema.map(item => {
        const {id, label, width = 'auto', sort = false, hidden = false} = item;
        if (hidden) {
            return null;
        }

        return (
            <TableCell key={id} width={width} align={getAlignment(item)}>
                {sort ?
                    <TableSortLabel
                        active={orderBy === id}
                        direction={orderBy === id ? order : 'asc'}
                        onClick={() => onSort(id)}
                    >
                        {label}
                        {orderBy === id && <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>}
                    </TableSortLabel> :
                    label
                }
            </TableCell>
        );
    }));

    return <TableHead><TableRow>{renderTableHead()}</TableRow></TableHead>;
};

TableHeader.propTypes = {
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired
};

export default TableHeader;
