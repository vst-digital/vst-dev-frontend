import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import isFunction from "lodash/isFunction";
import get from "lodash/get";
import fill from "lodash/fill";
import {
    IconButton,
    LinearProgress,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import MoreVert from "@material-ui/icons/MoreVert";

import TableToolbar from "./TableToolbar";
import TableHeader from "./TableHeader";

const useStyles = makeStyles((theme) => ({
    denseRow: {
        padding: theme.spacing(0.25, 2)
    },
    noDataFound: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(3),
        backgroundColor: theme.palette.grey[100],
        border: `2px dashed ${theme.palette.grey[300]}`
    }
}));

const createArray = (length, value = null) => Array.from({length}).fill(value);

const DataGridTable = (props) => {
    const classes = useStyles();
    const {
        schema,
        data,
        title,
        totalCount,
        toolbar,
        pagination,
        loading,
        rowsPerPageOptions,
        actions,
        onRowClick,
        fetchRecords,
        dense,
        hover
    } = props;

    const [localData, setLocalData] = useState([]);
    const [sortingState, setSortingState] = useState({order: props.order, orderBy: props.orderBy});
    const [paginationState, setPaginationState] = useState({
        page: props.page,
        rowsPerPage: props.rowsPerPage
    });
    const [isLoading, toggleLoading] = useState(loading);
    const [isProgressing, toggleProgressing] = useState(false);
    const [anchorElList, setAnchorElList] = useState([]);

    useEffect(() => {
        if (typeof data === 'object') {
            setLocalData(data);
            setAnchorElList(createArray(data.length));
        } else {
            toggleLoading(true);
            data().then(res => {
                setLocalData(res);
                setAnchorElList(createArray(res.length));
            }).catch(error => {
                console.error(error);
                setLocalData([]);
                setAnchorElList([]);
            }).finally(_ => toggleLoading(false));
        }
    }, []);

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    };

    const getComparator = ({order, orderBy}) => order === "desc" ?
        (a, b) => descendingComparator(a, b, orderBy) :
        (a, b) => -descendingComparator(a, b, orderBy);

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const rowClickHandler = row => onRowClick && onRowClick(row);

    const onSort = (orderBy) => {
        const isAsc = (sortingState.orderBy === orderBy) && (sortingState.order === 'asc');
        setSortingState({order: isAsc ? 'desc' : 'asc', orderBy: orderBy});
    };

    const pageChangeHandler = (_, newPage) => {
        const recordNum = (newPage + 1) * paginationState.rowsPerPage;
        if (localData.length < recordNum && localData.length < totalCount) {
            toggleProgressing(true);
            fetchRecords().then(res => {
                setLocalData([...localData, ...res]);
                setPaginationState({...paginationState, page: newPage});
                setAnchorElList([...anchorElList, createArray(res.length)]);
            }).catch(error => {
                console.error(error)
            }).finally(_ => toggleProgressing(false));
        } else {
            setPaginationState({...paginationState, page: newPage});
        }
    }

    const rowsPerPageChangeHandler = (event) => {
        const newValue = parseInt(event.target.value, 10);
        if (localData.length < newValue && localData.length < totalCount) {
            toggleProgressing(true);
            fetchRecords(newValue, 1).then(res => {
                setLocalData(res);
                setPaginationState({page: 0, rowsPerPage: newValue});
                setAnchorElList([...anchorElList, createArray(res.length)]);
            }).catch(error => {
                console.error(error)
            }).finally(_ => toggleProgressing(false));
        } else {
            setPaginationState({page: 0, rowsPerPage: newValue});
        }
    };

    const renderSkeleton = () => (
        fill(Array(paginationState.rowsPerPage), 1).map((_, i) => (
            <TableRow key={`${i}-skeletonRow`}>
                {schema.map(col => (
                    !col.hidden && <TableCell key={`${i}-skeletonCell-${col.id}`}>
                        <Skeleton animation="wave"/>
                    </TableCell>
                ))}
            </TableRow>
        ))
    );

    const renderRows = () => {
        const start = (paginationState.page) * paginationState.rowsPerPage;
        const end = paginationState.page * paginationState.rowsPerPage + paginationState.rowsPerPage;
        return (
            stableSort(localData, getComparator(sortingState)).slice(start, end).map((row, index) => {
                return (
                    <TableRow key={row.id} hover={hover} onClick={() => rowClickHandler(row)}>
                        {renderCell(row, index)}
                    </TableRow>
                );
            })
        );
    }

    const renderCell = (row, index) => {
        const tableCells = [];
        schema.forEach(column => {
            if (!column.hidden) {
                let tableCell;
                if (column.type === 'render') {
                    tableCell = <TableCell
                        key={`${index}_${column.id}`}
                        align="inherit"
                        className={cn({[classes.denseRow]: dense})}
                    >
                        {column.render(row)}
                    </TableCell>;
                } else if (column.type === 'actions') {
                    tableCell = <TableCell
                        key={`${index}_${column.id}`}
                        align="right"
                        className={cn({[classes.denseRow]: dense})}
                    >
                        {createActions(column.actions, row, index)}
                    </TableCell>;
                } else if (column.type === 'rowActions') {
                    tableCell = <TableCell
                        key={`${index}_${column.id}`}
                        align="right"
                        className={cn({[classes.denseRow]: dense})}
                    >
                        {column.render(row)}
                    </TableCell>;
                } else {
                    tableCell = <TableCell
                        key={`${index}_${column.id}`}
                        align={column.type === "number" ? "right" : "inherit"}
                        className={cn({[classes.denseRow]: dense})}
                    >
                        {get(row, column.id, '')}
                    </TableCell>;
                }
                tableCells.push(tableCell);
            }
        });
        return tableCells;
    };

    const actionClickHandler = (e, index, action, row) => {
        e.stopPropagation();
        clearAnchorElement(index);
        action.onClick(row)
    }

    const setAnchorElement = (e, index) => {
        e.stopPropagation();
        let newAnchorElList = [...anchorElList];
        newAnchorElList[index] = e.currentTarget;
        setAnchorElList(newAnchorElList);
    }

    const clearAnchorElement = (index) => {
        let newAnchorElList = [...anchorElList];
        newAnchorElList[index] = null;
        setAnchorElList(newAnchorElList);
    }

    const createActions = (actions, row, index) => {
        if (actions && actions.length > 0) {
            return (
                <>
                    <IconButton onClick={e => setAnchorElement(e, index)}><MoreVert/></IconButton>
                    <Menu
                        anchorEl={anchorElList[index]}
                        keepMounted
                        open={Boolean(anchorElList[index])}
                        onClose={() => clearAnchorElement(index)}
                        getContentAnchorEl={null}
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        transformOrigin={{vertical: "top", horizontal: "right"}}
                    >
                        {actions.map((action, actionIndex) => {
                            const menuItemProps = {
                                key: `${actionIndex}-${action.id}`,
                                disabled: isFunction(action.disabled) ? action.disabled(row) : !!action.disabled
                            };
                            const hidden = isFunction(action.hidden) ? action.hidden(row) : !!action.hidden
                            return !hidden ? (
                                <MenuItem {...menuItemProps} onClick={(e) => actionClickHandler(e, index, action, row)}>
                                    {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
                                    {action.label && <ListItemText primary={action.label}/>}
                                </MenuItem>
                            ) : null;
                        })}
                    </Menu>
                </>
            );
        } else {
            return null;
        }
    }

    return (
        <Paper elevation={2}>
            {toolbar && <TableToolbar title={title} actions={actions}/>}
            <TableContainer>
                <MuiTable>
                    <TableHeader
                        schema={schema}
                        order={sortingState.order}
                        orderBy={sortingState.orderBy}
                        onSort={onSort}
                    />
                    {isProgressing && (
                        <TableRow>
                            <TableCell colSpan="1000" padding="none"><LinearProgress/></TableCell>
                        </TableRow>
                    )}
                    <TableBody>
                        {!isLoading ? renderRows() : renderSkeleton()}
                        {!isLoading && localData.length <= 0 && (
                            <TableRow>
                                <TableCell colSpan="1000">
                                    <Typography variant={"h3"} className={classes.noDataFound}>
                                        No Data Found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </MuiTable>
            </TableContainer>
            {pagination && <TablePagination
                component={"div"}
                rowsPerPageOptions={rowsPerPageOptions}
                count={totalCount}
                rowsPerPage={paginationState.rowsPerPage}
                page={paginationState.page}
                onChangePage={pageChangeHandler}
                onChangeRowsPerPage={rowsPerPageChangeHandler}
            />}
        </Paper>
    );
};

DataGridTable.propTypes = {
    title: PropTypes.string,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.func
    ]),
    order: PropTypes.oneOf(["asc", "desc"]),
    orderBy: PropTypes.string,
    page: PropTypes.number,
    rowsPerPage: PropTypes.oneOf([10, 25, 50]),
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    totalCount: PropTypes.number,
    toolbar: PropTypes.bool,
    pagination: PropTypes.bool,
    loading: PropTypes.bool,
    actions: PropTypes.array,
    dense: PropTypes.bool,
    hover: PropTypes.bool,
    onRowClick: PropTypes.func,
    fetchRecords: PropTypes.func
};

DataGridTable.defaultProps = {
    order: "asc",
    orderBy: "",
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    toolbar: false,
    pagination: false,
    loading: false,
    actions: [],
    dense: false,
    hover: false
};

export default DataGridTable;
