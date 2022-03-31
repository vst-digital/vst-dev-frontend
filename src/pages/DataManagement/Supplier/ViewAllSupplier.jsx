import {useState} from "react";
import Button from "@material-ui/core/Button";
import AddRounded from "@material-ui/icons/AddRounded";

import {useHttp} from "hooks";
import {ConfirmModal, Container, IndexTable} from "components";
import {deleteSupplier, getSupplier, getSuppliers2} from "shared/services";
import {Supplier} from "shared/models";
import {SupplierSchema} from "shared/utilities/dataGridSchema";

const ViewAllSupplier = ({history}) => {
    const {requestHandler, notify} = useHttp();
    const [refreshTable, setRefreshTable] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        open: false, data: null,
        title: 'Do you want to delete?'
    });

    const getSupplierList = ({per_page, page_no, sort, filter}) => new Promise(async (resolve) => {
        const params = {per_page, page_no, sort, filter, include: 'address'};
        try {
            const res = await requestHandler(getSuppliers2(params));
            const data = res.data;
            const count = res.meta.pagination.count;
            resolve({data, count});
        } catch (e) {
            console.error(e);
            resolve({data: [], count: 0});
        }
    });

    const openConfirmModal = (data) => setConfirmModal({...confirmModal, open: true, data});

    const closeConfirmModal = async (isConfirm) => {
        setConfirmModal({...confirmModal, open: false});
        if (isConfirm) {
            await deleteHandler(confirmModal.data);
        }
    };

    const onAddClick = () => history.push(`/supplier/new`, {data: {action: 'Add', supplier: new Supplier()}});

    const editHandler = async (row) => {
        if (row && row.id) {
            try {
                const res = await requestHandler(getSupplier(row.id), {loader: true});
                history.push(`/supplier/edit`, {data: {action: 'Edit', supplier: new Supplier(res.data)}});
            } catch (e) {
                notify({msg: 'Not able to get selected supplier. Something went wrong!!', type: 'error'});
            }
        }
    };

    const viewHandler = async (row) => {
        if (row && row.id) {
            try {
                const res = await requestHandler(getSupplier(row.id), {loader: true});
                history.push(`/supplier/view`, {data: new Supplier(res.data)});
            } catch (e) {
                notify({msg: 'Not able to get selected supplier. Something went wrong!!', type: 'error'});
            }
        }
    };

    const deleteHandler = async (id) => {
        try {
            await requestHandler(deleteSupplier(id), {loader: true});
            notify({msg: 'Supplier has been deleted successfully.', type: 'success'});
            setRefreshTable(true);
            setTimeout(() => {setRefreshTable(false)});
        } catch (e) {
            notify({msg: 'Not able to delete selected supplier. Something went wrong!!', type: 'error'});
        }
    };

    const renderRowContextMenu = (menuProps, {rowProps: {data: row}}) => {
        menuProps.autoDismiss = true;
        menuProps.items = [
            {label: 'Edit Supplier', onClick: () => editHandler(row)},
            {label: 'View Supplier', onClick: () => viewHandler(row)},
            {label: 'Delete Supplier', onClick: () => openConfirmModal(row.id)}
        ];
    };

    return (
        <>
            <ConfirmModal
                title={confirmModal.title}
                open={confirmModal.open}
                close={closeConfirmModal}
            />
            <Container title="Suppliers" actions={
                <Button variant="contained" color="primary" startIcon={<AddRounded/>} onClick={onAddClick}>
                    Add Supplier
                </Button>
            }>
                {!refreshTable && <IndexTable
                    columns={SupplierSchema.columns}
                    defaultFilterValue={SupplierSchema.filter}
                    loadData={getSupplierList}
                    renderRowContextMenu={renderRowContextMenu}
                />}
            </Container>
        </>
    );
};

export default ViewAllSupplier;
