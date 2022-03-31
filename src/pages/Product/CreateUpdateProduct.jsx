import {useState} from "react";
import {useFormik} from "formik";
import {
    Button,
    Grid,
    InputLabel,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import {useHttp} from "hooks";
import {Container, Panel, TextField} from "components";
import {postProduct, putProduct} from "shared/services";
import {Product} from "shared/models";
import ProductRouteModal from "./modals/ProductRouteModal";

const useStyles = makeStyles((theme) => ({
    rowActions: {
        '& > :last-child :hover': {color: theme.palette.error.dark},
        '& > :not(:last-child) :hover': {color: theme.palette.primary.dark},
        '& > :not(:last-child)': {marginRight: theme.spacing(2)}
    },
    noDataFound: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

const CreateUpdateProduct = ({history, location}) => {
    const classes = useStyles();
    const {action = 'Add', product} = location.state?.data;
    const {notify, requestHandler} = useHttp();
    const [productRouteModal, setProductRouteModal] = useState({
        open: false, action: 'Add', data: null, index: -1
    });

    const openProductRouteModal = (action = 'Add', data = null, index = -1) => {
        setProductRouteModal({open: true, action, data, index});
    };

    const closeProductRouteModal = () => setProductRouteModal({open: false, action: 'Add', data: null, index: -1});

    const confirmProductRouteModal = (data) => {
        const {action, index} = productRouteModal;
        closeProductRouteModal();

        const product = new Product(values);
        action === 'Add' ? product.addProductRoute(data) : product.updateProductRoute(data, index);
        setValues(product);
    };

    const deleteProductRoute = (index) => {
        const product = new Product(values);
        product.removeProductRoute(index);
        setValues(product);
    };

    const onConfirm = async (values) => {
        const payload = {product: {...values}};
        try {
            const requestConfig = (action === 'Add') ? postProduct(payload) : putProduct(values.id, payload);
            await requestHandler(requestConfig, {loader: true});
            notify({msg: 'Product has been saved successfully!!', type: 'success'});
            history.push('/product');
        } catch (e) {
            notify({msg: 'Not able to save product. Something went wrong!!', type: 'error'});
        }
    };

    const {values, errors, touched, handleChange, handleSubmit, setValues} = useFormik({
        initialValues: product,
        onSubmit: onConfirm
    });

    return (
        <>
            {productRouteModal.open && <ProductRouteModal
                action={productRouteModal.action}
                data={productRouteModal.data}
                onClose={closeProductRouteModal}
                onConfirm={confirmProductRouteModal}
            />}

            <form onSubmit={handleSubmit}>
                <Container title={`${action} Product`} actions={
                    <>
                        <Button type="submit" color="primary" variant="contained">Save</Button>
                        <Button variant="contained" onClick={() => history.push('/product')}>Cancel</Button>
                    </>}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Panel title="Product Information">
                                <Grid container spacing={2} alignItems={"center"}>
                                    <Grid item xs={2}><InputLabel htmlFor="name">Name</InputLabel></Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            id="name"
                                            value={values.name} onChange={handleChange}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={2}><InputLabel htmlFor="volume">Volume</InputLabel></Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            id="volume" type="number"
                                            value={values.volume} onChange={handleChange}
                                            error={touched.volume && Boolean(errors.volume)}
                                            helperText={touched.volume && errors.volume}
                                        />
                                    </Grid>
                                </Grid>
                            </Panel>
                        </Grid>

                        <Grid item xs={12}>
                            <Panel title="Product Routes" actions={
                                <Button variant="contained" color="primary" onClick={() => openProductRouteModal()}>
                                    Add
                                </Button>
                            }>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Route</TableCell>
                                            <TableCell>Contractor</TableCell>
                                            <TableCell>Tonnage</TableCell>
                                            <TableCell>Avg. Rate</TableCell>
                                            <TableCell>Avg. Load Weight</TableCell>
                                            <TableCell>Max Load Weight</TableCell>
                                            <TableCell align={"right"} width={100}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            values.product_routes.filter(stop => !stop._destroy).length > 0 ?
                                                values.product_routes.filter(stop => !stop._destroy).map((item, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{item?.route?.route_code}</TableCell>
                                                        <TableCell>{item?.contractor?.name}</TableCell>
                                                        <TableCell>{item.std_tonnage}</TableCell>
                                                        <TableCell>{item.avg_rate}</TableCell>
                                                        <TableCell>{item.avg_load_weight}</TableCell>
                                                        <TableCell>{item.max_load_weight}</TableCell>
                                                        <TableCell align={"right"}>
                                                            <div className={classes.rowActions}>
                                                                <Tooltip title={"Edit"}>
                                                                    <SvgIcon
                                                                        component={EditIcon} color="action"
                                                                        onClick={() => openProductRouteModal('Edit', item, i)}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title={"Delete"}>
                                                                    <SvgIcon
                                                                        component={DeleteIcon} color="action"
                                                                        onClick={() => deleteProductRoute(i)}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan="1000">
                                                            <Typography variant={"h4"} className={classes.noDataFound}>
                                                                No Data Found
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                        }
                                    </TableBody>
                                </Table>
                            </Panel>
                        </Grid>
                    </Grid>
                </Container>
            </form>
        </>
    );
};

export default CreateUpdateProduct;