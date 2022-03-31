import {useState} from "react";
import {Button, makeStyles, Menu, MenuItem, SvgIcon} from "@material-ui/core";
import AddRounded from "@material-ui/icons/AddRounded";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";

import {useHttp} from "hooks";
import {ConfirmModal, Container, IndexTable} from "components";
import {deleteProduct, getProduct, getProducts2} from "shared/services";
import {Product} from "shared/models";
import {ProductSchema} from "shared/utilities/dataGridSchema";
import {createArray} from "shared/utilities/common.util";

const useStyles = makeStyles(theme => ({
    moreBtn: {
        cursor: "pointer",
        "&:hover": {color: theme.palette.primary.dark}
    },
    actionIcon: {
        "& > :not(:last-child)": {
            marginRight: theme.spacing(1.5),
            fontSize: theme.spacing(2.5)
        }
    }
}))

const ViewAllProduct = ({history}) => {
    const classes = useStyles();
    const {notify, requestHandler} = useHttp();
    const [refreshTable, setRefreshTable] = useState(false);
    const [confirmModal, setConfirmModal] = useState({open: false, data: null, title: ''});
    const [anchorElList, setAnchorElList] = useState([]);

    const renderActions = (row) => (<>
        <SvgIcon component={MoreIcon} className={classes.moreBtn} onClick={e => setAnchorElement(e, row.id)}/>
        <Menu
            anchorEl={anchorElList[row.id]}
            keepMounted
            open={Boolean(anchorElList[row.id])}
            onClose={() => clearAnchorElement(row.id)}
            getContentAnchorEl={null}
            anchorOrigin={{vertical: "bottom", horizontal: "left"}}
            transformOrigin={{vertical: "top", horizontal: "left"}}
        >
            <MenuItem onClick={() => editHandler(row.id)} className={classes.actionIcon}>
                <EditIcon color={"action"}/> Edit
            </MenuItem>
            <MenuItem onClick={() => openConfirmModal(row.id)} className={classes.actionIcon}>
                <DeleteIcon color={"action"}/> Delete
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

    const getProductList = ({per_page, page_no, sort, filter}) => new Promise(async (resolve) => {
        try {
            const res = await requestHandler(getProducts2({per_page, page_no, sort, filter}));
            const data = res.data;
            const count = res.meta.pagination.count;
            setAnchorElList(createArray(data.length));
            resolve({data, count});
        } catch (e) {
            console.error(e);
            setAnchorElList([]);
            resolve({data: [], count: 0});
        }
    });

    const openConfirmModal = (data) => {
        clearAnchorElement(data);
        setConfirmModal({
            ...confirmModal, open: true, data,
            title: `Do you want to delete product?`
        });
    };

    const closeConfirmModal = async (isConfirm) => {
        setConfirmModal({...confirmModal, open: false});
        if (isConfirm) {
            await deleteHandler(confirmModal.data);
        }
    };

    const onAddClick = () => history.push(`/product/new`, {data: {action: 'Add', product: new Product()}});

    const editHandler = async (id) => {
        clearAnchorElement(id);
        try {
            const params = {include: 'product_routes,product_routes.route,product_routes.route_rate,product_routes.contractor'};
            const res = await requestHandler(getProduct(id, params), {loader: true});
            history.push(`/product/edit`, {data: {action: 'Edit', product: new Product(res.data)}});
        } catch (e) {
            notify({msg: 'Not able to get selected route. Something went wrong!!', type: 'error'});
        }
    };

    const deleteHandler = async (id) => {
        try {
            await requestHandler(deleteProduct(id), {loader: true});
            notify({msg: 'Product has been deleted successfully.', type: 'success'});
            setRefreshTable(true);
            setTimeout(() => {
                setRefreshTable(false)
            });
        } catch (e) {
            notify({msg: 'Not able to delete selected product. Something went wrong!!', type: 'error'});
        }
    };

    return (
        <>
            <ConfirmModal
                title={confirmModal.title}
                open={confirmModal.open}
                close={closeConfirmModal}
            />
            <Container title="Products" actions={
                <Button variant="contained" color="primary" startIcon={<AddRounded/>} onClick={onAddClick}>
                    Add Product
                </Button>
            }>
                {!refreshTable && <IndexTable
                    columns={[
                        {
                            name: 'actions', header: '', defaultWidth: 60, textAlign: 'center',
                            render: ({data}) => renderActions(data)
                        },
                        ...ProductSchema.columns
                    ]}
                    defaultFilterValue={ProductSchema.filter}
                    loadData={getProductList}
                />}
            </Container>
        </>
    );
};

export default ViewAllProduct;