import PropTypes from 'prop-types';
import {Checkbox, makeStyles, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';

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

const StyledTableHead = (props) => {
    const classes = useStyles();
    const {schema, selection, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const sortHandler = property => onRequestSort(property);

    return <TableHead>
        <TableRow>
            {selection && <TableCell padding="checkbox">
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                />
            </TableCell>}
            {schema.map(headCell => {
                if (headCell.hidden) return null;

                return <TableCell
                    key={headCell.id}
                    align={headCell.id === 'actions' ? 'right' : 'inherit'}
                    sortDirection={orderBy === headCell.id ? order : false}
                >
                    {headCell.sort ? <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => sortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id && <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>}
                    </TableSortLabel> : headCell.label}
                </TableCell>;
            })}
        </TableRow>
    </TableHead>;
};

StyledTableHead.propTypes = {
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    selection: PropTypes.bool.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default StyledTableHead;
