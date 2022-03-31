import {useEffect, useState} from "react";
import {
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    SvgIcon,
    Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/NoteAdd";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@material-ui/lab/Skeleton";

import {useHttp} from "hooks";
import {Panel} from "components";
import {deleteConfigField, getConfigField, postConfigField, putConfigField} from "shared/services";
import AddFieldModal from "../modal/AddFieldModal";
import ConfirmModal from "../modal/ConfirmModal";

const useStyles = makeStyles(theme => ({
    list: {
        maxHeight: '200px',
        height: '200px',
        overflow: 'scroll'
    },
    addBtn: {
        '&:hover': {
            color: theme.palette.primary.main,
            cursor: 'pointer'
        }
    },
    deleteBtn: {
        color: theme.palette.error.light,
        '&:hover': {
            color: theme.palette.error.main,
            cursor: 'pointer'
        }
    },
    noDataFound: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: '100%',
        padding: theme.spacing(3),
        margin: theme.spacing(0, 1),
        backgroundColor: theme.palette.grey[100],
        border: `2px dashed ${theme.palette.grey[300]}`
    }
}));

const ConfigList = ({title, type}) => {
    const classes = useStyles();
    const {requestHandler, notify} = useHttp();

    const [isLoading, toggleLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [modalState, setModalState] = useState({
        openAppModal: false,
        openConfirmModal: false,
        action: 'Add',
        fieldData: {id: '', name: ''}
    });

    useEffect(() => {
        getConfigDataList();
    }, []);

    const getConfigDataList = async () => {
        try {
            toggleLoading(true);
            const res = await requestHandler(getConfigField(type));
            setDataList(res.data);
            toggleLoading(false);
        } catch (e) {
            setDataList([]);
            toggleLoading(false);
        }
    };

    const addHandler = () => setModalState({...modalState, openAppModal: true});

    const editHandler = (id, name) => setModalState({
        ...modalState,
        openAppModal: true,
        action: 'Edit',
        fieldData: {id, name}
    });

    const deleteHandler = (id) => setModalState({
        ...modalState,
        openConfirmModal: true,
        fieldData: {...modalState.fieldData, id}
    });

    const cancelHandler = () => setModalState({
        openAppModal: false,
        openConfirmModal: false,
        action: 'Add',
        fieldData: {id: '', name: ''}
    });

    const confirmDeleteHandler = async () => {
        const {id} = modalState.fieldData;
        try {
            await requestHandler(deleteConfigField(id, type), {loader: true});
            await getConfigDataList();
        } catch (e) {
            notify({msg: 'Not able to delete. Something went wrong!!', type: 'error'});
        }
        cancelHandler();
    };

    const confirmHandler = async (name) => {
        const {fieldData: {id}, action} = modalState;
        const payload = {id, name};
        try {
            const requestConfig = action === 'Add' ? postConfigField(type, payload) : putConfigField(id, type, payload);
            await requestHandler(requestConfig, {loader: true});
            await getConfigDataList();
        } catch (e) {
            notify({msg: 'Not able to save. Something went wrong!!', type: 'error'});
        }
        cancelHandler();
    };

    return (
        <>
            {modalState.openAppModal && <AddFieldModal
                title={modalState.action}
                fieldName={modalState.fieldData.name}
                onConfirm={confirmHandler}
                onCancel={cancelHandler}
            />}
            {modalState.openConfirmModal && <ConfirmModal
                onConfirm={confirmDeleteHandler}
                onCancel={cancelHandler}
            />}
            <Panel title={title} contentStyle={{padding: 0}} actions={
                <SvgIcon className={classes.addBtn} component={AddIcon} onClick={addHandler}/>
            }>
                <List component="nav" className={classes.list}>
                    {!isLoading && dataList.length > 0 && dataList.map(item => <ListItem
                        key={item.id} button divider
                        onClick={() => editHandler(item.id, item.name)}
                    >
                        <ListItemText>
                            <Typography variant={"body1"}>{item.name}</Typography>
                        </ListItemText>
                        <ListItemSecondaryAction style={{right: '12px'}}>
                            <SvgIcon
                                className={classes.deleteBtn}
                                component={DeleteIcon}
                                onClick={() => deleteHandler(item.id)}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>)}

                    {!isLoading && dataList.length === 0 && (
                        <Typography variant={"h2"} className={classes.noDataFound}>No Data Found</Typography>
                    )}

                    {isLoading && [1, 2, 3, 4].map(item => <ListItem key={item}>
                        <ListItemText><Skeleton animation="wave" variant="rect" height={20}/></ListItemText>
                    </ListItem>)}
                </List>
            </Panel>
        </>
    );
};

export default ConfigList;
