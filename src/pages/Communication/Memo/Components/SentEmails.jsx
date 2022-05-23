import { useState, useEffect } from "react";
import { Button, makeStyles, Menu, MenuItem, SvgIcon, Grid, Card } from "@material-ui/core";
import AddRounded from "@material-ui/icons/AddRounded";
import ViewIcon from "@material-ui/icons/Visibility";
import MoreIcon from "@material-ui/icons/MoreVert";

import { useHttp } from "hooks";
import { Container, IndexTable } from "components";
import { getRecievedMemos, getMemo, getSentMemos } from "shared/services";
import { Memo } from "shared/models";
import { MemoSchema } from "shared/utilities/dataGridSchema";
import { createArray } from "shared/utilities/common.util";
import { DataGrid } from '@material-ui/data-grid';

import actionCable from "actioncable";
import { createTheme } from '@material-ui/core/styles';

const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) => {
        return {
            root: {
                '& .super-app-theme--true': {
                    padding: "1%",
                    fontSize: "14px",
                    '&:hover': {
                    },
                },
                '& .super-app-theme--false': {
                    padding: "1%",
                    fontWeight: "bold",
                    fontSize: "14px",
                    '&:hover': {
                    },
                }
            },
        };
    },
    { defaultTheme },
);

const RecievedEmails = ({ history }) => {
    const classes = useStyles();
    const { notify, requestHandler } = useHttp();
    const [refreshTable, setRefreshTable] = useState(false);
    const [anchorElList, setAnchorElList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableDataCount, setTableDataCount] = useState();
    const [loading, setLoading] = useState();

    const CableApp = {}
    CableApp.cable = actionCable.createConsumer(process.env.REACT_APP_BASE_CABLE)
    CableApp.cable.subscriptions.create({
        channel: 'MemoChannel',
        room: localStorage.getItem('user_id'),
        user: localStorage.getItem('token')
    },
        {
            received: (res) => {
                const data = JSON.parse(res["message"])
                const count = 1;
                setTableDataCount(prev => prev + count)
                setTableData(prev => [data.data.attributes, ...prev]);
            },
            connected: () => {
                console.log("Online")
            }
        });


    useEffect(() => {
        setTimeout(() => new Promise(async (resolve) => {
            try {
                const limit = 50
                const per_page = limit;
                const page_no = 1;
                const filter = {};
                const sort = '';
                const res = await requestHandler(getSentMemos({ per_page, page_no, sort, filter }));
                const data = res.data;
                const count = res.meta.pagination.count;
                setAnchorElList(createArray(data.length));
                resolve(setTableData(data));
                setRefreshTable(true)
                setLoading(false)
            } catch (e) {
                console.error(e);
                setTableData({ data: [], count: 0 });
                resolve({ data: [], count: 0 });
            }
        }), 1000)
    }, []);


    const onAddClick = () => {
        history.push(`/memo/new`, { data: { action: 'Add', Memo: new Memo() } });
    }

    const viewHandler = async (value) => {
        try {
            const res = await requestHandler(getMemo(value.id), { loader: true });
            history.push(`/memo/view`, { data: { action: 'View', memo: new Memo(res.data) } });
        } catch (e) {
            notify({ msg: 'Something went wrong', type: 'error' });
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'subject', headerName: 'subject', width: 500 },
        { field: 'sender_id', headerName: 'Sender', width: 200 },
        { field: 'created_at', headerName: 'Recieved At', width: 300 }
    ];

    return (<>

        <Container title="My Recieved Memos" actions={
            <Button variant="contained" color="primary" startIcon={<AddRounded />} onClick={onAddClick}>
                Create Memo
            </Button>
        }>
            <Card className={classes.root}>
                <DataGrid
                    rows={tableData}
                    columns={columns}
                    pageSize={20}
                    autoHeight
                    disableColumnSelector
                    disableSelectionOnClick
                    onCellClick={viewHandler}
                    getRowClassName={(params) => (
                        `super-app-theme--${params.getValue(params.id, 'read')}`
                    )}
                    loading={loading}
                />
            </Card>
        </Container>
    </>
    )
};

export default RecievedEmails;