import get from "lodash/get";
import {
    Button,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@material-ui/core";
import cn from "classnames";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.grey[200]
    },
    title: {flex: '1 1 100%'},
    action: {marginRight: theme.spacing(1)},
    denseRow: {padding: theme.spacing(0.25, 2)},
    noDataFound: {
        display: "flex",
        justifyContent: "center"
    }
}));

const InlineTable = ({title = '', toolbar = true, schema, actions = [], data = [], dense}) => {
    const classes = useStyles();

    const renderTableHead = () => (schema.map(item => {
        const {id, align = 'justify', label, width = 'auto'} = item;
        return <TableCell key={id} width={width} align={align}>{label}</TableCell>;
    }));

    const renderCell = (row, index) => {
        const tableCells = [];
        schema.forEach((column, i) => {
            let {id, align = 'justify'} = column;
            align = (id === 'actions') ? 'right' : align;
            tableCells.push(
                <TableCell
                    key={`${i}_${index}_${Date.now()}`}
                    align={align}
                    className={cn({[classes.denseRow]: (dense && (id === 'actions'))})}
                >
                    {column.render ? column.render(row, index) : get(row, column.id, '')}
                </TableCell>
            );
        });
        return tableCells;
    };

    const renderActions = () => actions.map(item => {
        const {id, color = 'primary', variant = 'contained', label, action, startIcon, endIcon} = item;
        return (
            <Button
                key={id} size='small'
                color={color} variant={variant}
                startIcon={startIcon}
                endIcon={endIcon}
                className={classes.action}
                onClick={action}
            >
                {label}
            </Button>
        );
    });

    return (
        <>
            {toolbar && <Toolbar className={classes.root} variant="dense">
                <Typography className={classes.title} variant="h5">{title}</Typography>
                {renderActions()}
            </Toolbar>}

            <Table size={dense ? 'small' : 'medium'}>
                <TableHead><TableRow>{renderTableHead()}</TableRow></TableHead>
                <TableBody>
                    {data.length > 0 && data.map((row, i) => {
                        if (!row._destroy) {
                            return <TableRow key={`${i}_${Date.now()}`}>{renderCell(row, i)}</TableRow>;
                        }
                    })}
                    {data.filter(item => !item._destroy).length <= 0 && <TableRow>
                        <TableCell colSpan="1000">
                            <Typography variant={"h4"} className={classes.noDataFound}>
                                No Data Found
                            </Typography>
                        </TableCell>
                    </TableRow>}
                </TableBody>
            </Table>
        </>
    );
};

export default InlineTable;
