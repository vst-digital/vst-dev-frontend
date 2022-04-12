import { useState } from "react";
import { Button, makeStyles, Menu, MenuItem, SvgIcon } from "@material-ui/core";
import AddRounded from "@material-ui/icons/AddRounded";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewIcon from "@material-ui/icons/Visibility";
import MoreIcon from "@material-ui/icons/MoreVert";

import { useHttp } from "hooks";
import { ConfirmModal, Container, IndexTable } from "components";
import { getMemoTemplates, getMemoTemplate, postMemoTemplate, deleteMemoTemplate } from "shared/services";
import { MemoTemplate } from "shared/models";
import { MemoTemplateSchema } from "shared/utilities/dataGridSchema";
import { createArray } from "shared/utilities/common.util";

const useStyles = makeStyles(theme => ({
    moreBtn: {
        cursor: "pointer",
        "&:hover": { color: theme.palette.primary.dark }
    },
    actionIcon: {
        "& > :not(:last-child)": {
            marginRight: theme.spacing(1.5),
            fontSize: theme.spacing(2.5)
        }
    }
}))

const ViewAllMemo = ({ history }) => {
    const classes = useStyles();
    const { notify, requestHandler } = useHttp();
    const [refreshTable, setRefreshTable] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false, data: null, title: '' });
    const [anchorElList, setAnchorElList] = useState([]);

    const renderActions = (row) => (<>
        <SvgIcon component={MoreIcon} className={classes.moreBtn} onClick={e => setAnchorElement(e, row.id)} />
        <Menu
            anchorEl={anchorElList[row.id]}
            keepMounted
            open={Boolean(anchorElList[row.id])}
            onClose={() => clearAnchorElement(row.id)}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
            <MenuItem onClick={() => viewHandler(row.id)} className={classes.actionIcon}>
                <ViewIcon color={"action"} /> View
            </MenuItem>
            <MenuItem onClick={() => editHandler(row.id)} className={classes.actionIcon}>
                <EditIcon color={"action"} /> Edit
            </MenuItem>
            <MenuItem onClick={() => openConfirmModal(row.id)} className={classes.actionIcon}>
                <DeleteIcon color={"action"} /> Delete
            </MenuItem>
        </Menu>
    </>);

    const setAnchorElement = (e, index) => {
        e.stopPropagation();
        let newAnchorElList = [...anchorElList];
        newAnchorElList[index] = e.currentTarget;
        setAnchorElList(newAnchorElList);
    };

    const clearAnchorElement = (index) => {
        let newAnchorElList = [...anchorElList];
        newAnchorElList[index] = null;
        setAnchorElList(newAnchorElList);
    };

    const getMemoTemplateList = ({ per_page, page_no, sort, filter }) => new Promise(async (resolve) => {
        try {
            const res = await requestHandler(getMemoTemplates({ per_page, page_no, sort, filter }));
            const data = res.data;
            const count = res.meta.pagination.count;
            setAnchorElList(createArray(data.length));
            resolve({ data, count });
        } catch (e) {
            console.error(e);
            setAnchorElList([]);
            resolve({ data: [], count: 0 });
        }
    });

    const openConfirmModal = (data) => {
        clearAnchorElement(data);
        setConfirmModal({
            ...confirmModal, open: true, data,
            title: `Do you want to delete this Template?`
        });
    };

    const closeConfirmModal = async (isConfirm) => {
        setConfirmModal({ ...confirmModal, open: false });
        if (isConfirm) {
            await deleteHandler(confirmModal.data);
        }
    };

    const onAddClick = () => history.push(`/memo/new`, { data: { action: 'Add', memoTemplate: new MemoTemplate() } });

    const editHandler = async (id) => {
        clearAnchorElement(id);
        try {
            const params = {};
            const res = await requestHandler(getMemoTemplate(id, params), { loader: true });
            history.push(`/memo/edit`, { data: { action: 'Edit', memoTemplate: new MemoTemplate(res.data) } });
        } catch (e) {
            notify({ msg: 'Not able to get selected route. Something went wrong!!', type: 'error' });
        }
    };

    const deleteHandler = async (id) => {
        try {
            await requestHandler(deleteMemoTemplate(id), { loader: true });
            notify({ msg: 'Template has been deleted successfully.', type: 'success' });
            setRefreshTable(true);
            setTimeout(() => {
                setRefreshTable(false)
            });
        } catch (e) {
            notify({ msg: 'Not able to delete selected Template. Something went wrong!!', type: 'error' });
        }
    };

    const viewHandler = async (id) => {
        try {
            const res = await requestHandler(getMemoTemplate(id), { loader: true });
            history.push(`/memo/view`, { data: { action: 'View', memoTemplate: new MemoTemplate(res.data) } });
        }catch(e){
            notify({msg: 'Something went wrong', type: 'error'});
        }
    }

    return (
        <>
            <ConfirmModal
                title={confirmModal.title}
                open={confirmModal.open}
                close={closeConfirmModal}
            />
            <Container title="My Memos" actions={
                <Button variant="contained" color="primary" startIcon={<AddRounded />} onClick={onAddClick}>
                    Create Memo
                </Button>
            }>
                {!refreshTable && <IndexTable
                    columns={[
                        {
                            name: 'actions', header: '', defaultWidth: 60, textAlign: 'center',
                            render: ({ data }) => renderActions(data)
                        },
                        ...MemoTemplateSchema.columns
                    ]}
                    defaultFilterValue={MemoTemplateSchema.filter}
                    loadData={getMemoTemplateList}
                />}
            </Container>
        </>
    );
};

export default ViewAllMemo;