import {useFormik} from "formik";
import {Button, Grid, InputLabel} from "@material-ui/core";

import {useHttp} from "../../../hooks";
import {Panel, TextField} from "../../../components";

const Settings = () => {
    const {notify, requestHandler} = useHttp();

    const onConfirm = async () => {
        // const payload = {company: values};
        try {
            await requestHandler({}, {loader: true});
            notify({msg: 'Prefix has been saved successfully!!', type: 'success'});
        } catch (e) {
            notify({msg: 'Not able to save prefix. Something went wrong!!', type: 'error'});
        }
    };

    const {values, handleChange, handleSubmit} = useFormik({
        initialValues: {},
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Panel title="Prefix" panelActions={
                <Button type="submit" color="primary" variant="contained">Save</Button>
            }>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <InputLabel htmlFor="vehicle_number_prefix">Vehicle No.</InputLabel>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="vehicle_number_prefix"
                            value={values.vehicle_number_prefix} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <InputLabel htmlFor="route_order_prefix">Route Order</InputLabel>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="route_order_prefix"
                            value={values.route_order_prefix} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <InputLabel htmlFor="empty_leg_route_order_prefix">Empty Leg Route
                            Order</InputLabel>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="empty_leg_route_order_prefix"
                            value={values.empty_leg_route_order_prefix} onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Panel>
        </form>
    );
};

export default Settings;
