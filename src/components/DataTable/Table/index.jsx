import {useEffect, useState} from "react";
import PropTypes from "prop-types";

import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Scrollbar from "react-custom-scrollbars-2";

import StyledTableToolbar from "./StyledTableToolbar";
import StyledTableHead from "./StyledTableHead";

const useStyles = makeStyles((theme) => ({
    paper: {width: "100%"},
    noDataFound: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(3),
        backgroundColor: theme.palette.grey[100],
        border: `2px dashed ${theme.palette.grey[300]}`
    }
}));

const Table = (props) => {
    const classes = useStyles();
    const {
        schema,
        title,
        data,
        toolbar,
        selection,
        pagination,
        rowsPerPageOptions,
        actions,
        onRowClick,
        onSelectAll,
        selectOnRowClick,
        async
    } = props;

    const [rowData, setRowData] = useState([]);
    const [order, setOrder] = useState(props.order);
    const [orderBy, setOrderBy] = useState(props.orderBy);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(props.page);
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage);
    const [loading, setLoading] = useState(async.loading);

    useEffect(() => {
        if (loading) {
            async.loadingData().then(data => {
                setLoading(false);
                setRowData(data);
            }).catch(error => {
                setLoading(false);
                console.error(error);
            });
        } else {
            setRowData(data);
        }
    }, [data]);

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    };

    const getComparator = (order, orderBy) => order === "desc" ?
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

    const handleRequestSort = (property) => {
        const isAsc = (orderBy === property) && (order === 'asc');
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        let newSelectList = [];
        if (event.target.checked) {
            newSelectList = rowData.map((n) => n.id);
            setSelected(newSelectList);
            return;
        }
        setSelected(newSelectList);
        if (onSelectAll) onSelectAll(newSelectList);
    };

    const handleClick = (row) => {
        if (selectOnRowClick) {
            const selectedIndex = selected.indexOf(row.id);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, row.id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
            setSelected(newSelected);
        }
        if (onRowClick) onRowClick(row);
    };

    const handleChangePage = (_, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = id => selected.indexOf(id) !== -1;

    const renderSkeleton = () => Array.from({length: rowsPerPage}, (_, i) => i).map(item => (
        <TableRow key={item}>
            {schema.map(col => (
                !col.hidden && <TableCell key={`${item}-${col.id}`}><Skeleton animation="wave"/></TableCell>
            ))}
        </TableRow>
    ));

    const renderRows = () => {
        const start = page * rowsPerPage;
        const end = page * rowsPerPage + rowsPerPage;
        return (
            stableSort(rowData, getComparator(order, orderBy)).slice(start, end).map((row, index) => {
                const isItemSelected = isSelected(row.id);
                return (
                    <TableRow
                        key={row.id}
                        hover role="checkbox"
                        selected={isItemSelected}
                        onClick={() => handleClick(row)}
                    >
                        {selection && <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected}/>
                        </TableCell>}
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
                if (column.type === "render") {
                    tableCells.push(
                        <TableCell
                            key={`${index}_${column.id}`}
                            align={column.id === 'actions' ? 'right' : 'inherit'}
                        >
                            {column.render(row)}
                        </TableCell>
                    );
                } else {
                    tableCells.push(<TableCell key={`${index}_${column.id}`}>{row[column.id]}</TableCell>);
                }
            }
        });
        return tableCells;
    };

    return (
        <Paper elevation={2}>
            {toolbar && <StyledTableToolbar title={title} numSelected={selected.length} actions={actions}/>}
            <TableContainer>
                <Scrollbar autoHide autoHeight autoHeightMin={0} autoHeightMax={"100%"}>
                    <MuiTable>
                        <StyledTableHead
                            schema={schema}
                            selection={selection}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rowData.length}
                        />
                        <TableBody>
                            {!loading ? renderRows(): renderSkeleton()}
                            {!loading && rowData.length <= 0 && <TableRow>
                                <TableCell colSpan="1000">
                                    <Typography variant={"h3"} className={classes.noDataFound}>
                                        No Data Found
                                    </Typography>
                                </TableCell>
                            </TableRow>}
                        </TableBody>
                    </MuiTable>
                </Scrollbar>
            </TableContainer>
            {pagination && <TablePagination
                component={"div"}
                rowsPerPageOptions={rowsPerPageOptions}
                count={rowData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />}
        </Paper>
    );
};

Table.propTypes = {
    title: PropTypes.string,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.oneOf(["asc", "desc"]),
    orderBy: PropTypes.string,
    page: PropTypes.number,
    rowsPerPage: PropTypes.oneOf([5, 10, 25, 50]),
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    toolbar: PropTypes.bool,
    selection: PropTypes.bool,
    pagination: PropTypes.bool,
    actions: PropTypes.array,
    selectOnRowClick: PropTypes.bool,
    onRowClick: PropTypes.func,
    onSelectAll: PropTypes.func,
    async: PropTypes.shape({
        loading: PropTypes.bool,
        loadingData: PropTypes.func
    })
};

Table.defaultProps = {
    data: [],
    order: "asc",
    orderBy: "",
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25, 50],
    toolbar: true,
    selection: false,
    pagination: false,
    actions: [],
    selectOnRowClick: false,
    async: {
        loading: false,
        loadingData: null
    }
};

export default Table;
