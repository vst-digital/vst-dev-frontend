import {useFormik} from "formik";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, SvgIcon} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import {useHttp} from "hooks";
import {AsyncSelect, TextField} from "components";
import {ProductRoute} from "shared/models";
import {getConfigField, getRoutes} from "shared/services";
import {errorMessage, getSelectDataSource, hasError} from "shared/utilities/common.util";
import {PRODUCT_ROUTE} from "shared/utilities/validationSchema.util";
import {CONFIG_FIELD_TYPE} from "shared/utilities/constant";

const useStyles = makeStyles((theme) => ({
    title: {
        '&>h2': {
            ...theme.typography.h4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }
    },
    closeBtn: {
        '&:hover': {color: theme.palette.error.main,}
    }
}));

const ProductRouteModal = ({action, data, onClose, onConfirm}) => {
    const classes = useStyles();
    const {requestHandler} = useHttp();

    const getRouteList = () => new Promise((resolve, reject) => {
        getSelectDataSource(requestHandler, getRoutes({per_page: 500, page_no: 1}))
            .then(res => resolve(res.data))
            .catch(error => reject(error));
    });

    const getContractorList = () => new Promise(async (resolve, reject) => {
        const requestConfig = getConfigField(CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR, 500);
        getSelectDataSource(requestHandler, requestConfig)
            .then(res => resolve(res.data))
            .catch(error => reject(error));
    });

    const onRouteChange = (route) => {
        const productRoute = new ProductRoute(values);
        productRoute.setRoute(route);
        setValues(productRoute);
    };

    const onContractorChange = (contractor) => {
        const productRoute = new ProductRoute(values);
        productRoute.setContractor(contractor);
        setValues(productRoute);
    };

    const {values, touched, errors, handleChange, handleSubmit, setValues} = useFormik({
        initialValues: new ProductRoute(data),
        validationSchema: PRODUCT_ROUTE,
        onSubmit: (values) => onConfirm(values)
    });

    return (
        <Dialog id="product_route_modal" maxWidth="sm" open={true} fullWidth onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle className={classes.title}>
                    {`${action} Product Route`}
                    {onClose && <SvgIcon component={CloseIcon} className={classes.closeBtn} onClick={onClose}/>}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item xs={6}>
                            <AsyncSelect
                                id="route_id" label="Route"
                                getOptionLabel={option => option.route_code + ''}
                                loadingMethod={getRouteList}
                                value={values.route} onChange={onRouteChange}
                                error={hasError('route_id', touched, errors)}
                                helperText={errorMessage('route_id', touched, errors)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <AsyncSelect
                                id="contractor_id" label="Contractor"
                                getOptionLabel={option => option.name}
                                loadingMethod={getContractorList}
                                value={values.contractor} onChange={onContractorChange}
                                error={hasError('contractor_id', touched, errors)}
                                helperText={errorMessage('contractor_id', touched, errors)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="std_tonnage" type="number" label="Tonnage"
                                value={values.std_tonnage} onChange={handleChange}
                                error={hasError('std_tonnage', touched, errors)}
                                helperText={errorMessage('std_tonnage', touched, errors)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="avg_rate" type="number" label="Avg. Rate"
                                value={values.avg_rate} onChange={handleChange}
                                error={hasError('avg_rate', touched, errors)}
                                helperText={errorMessage('avg_rate', touched, errors)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="avg_load_weight" type="number" label="Avg. Load Weight"
                                value={values.avg_load_weight} onChange={handleChange}
                                error={hasError('avg_load_weight', touched, errors)}
                                helperText={errorMessage('avg_load_weight', touched, errors)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="max_load_weight" type="number" label="Max Load Weight"
                                value={values.max_load_weight} onChange={handleChange}
                                error={hasError('max_load_weight', touched, errors)}
                                helperText={errorMessage('max_load_weight', touched, errors)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="route_rate.count_in_hand" type="number" label="Count (In Hand)"
                                value={values.route_rate.count_in_hand} onChange={handleChange}
                                error={hasError('route_rate.count_in_hand', touched, errors)}
                                helperText={errorMessage('route_rate.count_in_hand', touched, errors)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="route_rate.rate_per_tone" type="number" label="Rate per tone"
                                value={values.route_rate.rate_per_tone} onChange={handleChange}
                                error={hasError('route_rate.rate_per_tone', touched, errors)}
                                helperText={errorMessage('route_rate.rate_per_tone', touched, errors)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="route_rate.avg_tonnage" type="number" label="Avg. Tonnage"
                                value={values.route_rate.avg_tonnage} onChange={handleChange}
                                error={hasError('route_rate.avg_tonnage', touched, errors)}
                                helperText={errorMessage('route_rate.avg_tonnage', touched, errors)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">Confirm</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductRouteModal;
