import {useFormik} from "formik";
import get from "lodash/get";
import {Button, Grid, InputLabel} from "@material-ui/core";

import {useHttp} from "hooks";
import {Container, Section, TextField} from "components";
import {postSupplier, putSupplier} from "shared/services";

const CreateUpdateSupplier = ({history, location}) => {
    const {action = 'Add', supplier} = location.state?.data;
    const {notify, requestHandler} = useHttp();

    const onClose = () => history.push('/supplier');

    const onConfirm = async () => {
        const payload = {supplier: values};
        try {
            const requestConfig = (action === 'Add') ? postSupplier(payload) : putSupplier(values.id, payload);
            await requestHandler(requestConfig, {loader: true});
            notify({msg: 'Supplier has been saved successfully!!', type: 'success'});
            history.push('/supplier');
        } catch (e) {
            notify({msg: 'Not able to save supplier. Something went wrong!!', type: 'error'});
        }
    };

    const {values, errors, touched, handleChange, handleSubmit} = useFormik({
        initialValues: supplier,
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Container title={`${action} Supplier`} paper actions={
                <>
                    <Button type="submit" color="primary" variant="contained">Save</Button>
                    <Button variant="contained" onClick={onClose}>Cancel</Button>
                </>
            }>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}><Section title="Personal Details"/></Grid>
                    <Grid item xs={3}><InputLabel htmlFor="name">Name</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="name"
                            value={values.name} onChange={handleChange}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />
                    </Grid>
                    <Grid item xs={3}><InputLabel htmlFor="email">Email Id</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="email" type="email"
                            value={values.email} onChange={handleChange}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                    </Grid>

                    <Grid item xs={3}><InputLabel htmlFor="company_name">Company Name</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField id="company_name" value={values.company_name} onChange={handleChange}/>
                    </Grid>
                    <Grid item xs={3}><InputLabel htmlFor="tax_number">Tax no.</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField id="tax_number" value={values.tax_number} onChange={handleChange}/>
                    </Grid>

                    <Grid item xs={12}><Section title="Bank Details"/></Grid>
                    <Grid item xs={3}><InputLabel htmlFor="bank_details.name">Account Holder Name</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField id="bank_details.name" value={values.bank_details.name} onChange={handleChange}/>
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel htmlFor="bank_details.account_number">Account No.</InputLabel>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="bank_details.account_number" type="number"
                            value={values.bank_details.account_number} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}><InputLabel htmlFor="bank_details.bank_name">Bank Name</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="bank_details.bank_name"
                            value={values.bank_details.bank_name} onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel htmlFor="bank_details.branch_code">Branch Code</InputLabel>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="bank_details.branch_code"
                            value={values.bank_details.branch_code} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}><Section title="Address Details"/></Grid>
                    <Grid item xs={3}><InputLabel htmlFor="address.address1">Address Line 1</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="address.address1"
                            value={values?.address?.address1} onChange={handleChange}
                            error={get(touched, 'address.address1', false) && Boolean(get(errors, 'address.address1'))}
                            helperText={get(touched, 'address.address1', false) && get(errors, 'address.address1')}
                        />
                    </Grid>
                    <Grid item xs={3}><InputLabel htmlFor="address.address2">Address Line 2</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="address.address2"
                            value={values?.address?.address2} onChange={handleChange}
                            error={get(touched, 'address.address2', false) && Boolean(get(errors, 'address.address2'))}
                            helperText={get(touched, 'address.address2', false) && get(errors, 'address.address2')}
                        />
                    </Grid>

                    <Grid item xs={3}><InputLabel htmlFor="address.city">City</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="address.city"
                            value={values?.address?.city} onChange={handleChange}
                            error={get(touched, 'address.city', false) && Boolean(get(errors, 'address.city'))}
                            helperText={get(touched, 'address.city', false) && get(errors, 'address.city')}
                        />
                    </Grid>
                    <Grid item xs={3}><InputLabel htmlFor="address.state">State</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="address.state"
                            value={values?.address?.state} onChange={handleChange}
                            error={get(touched, 'address.state', false) && Boolean(get(errors, 'address.state'))}
                            helperText={get(touched, 'address.state', false) && get(errors, 'address.state')}
                        />
                    </Grid>

                    <Grid item xs={3}><InputLabel htmlFor="address.country">Country</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="address.country"
                            value={values?.address?.country} onChange={handleChange}
                            error={get(touched, 'address.country', false) && Boolean(get(errors, 'address.country'))}
                            helperText={get(touched, 'address.country', false) && get(errors, 'address.country')}
                        />
                    </Grid>
                    <Grid item xs={3}><InputLabel htmlFor="address.phone">Phone no.</InputLabel></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="address.phone"
                            value={values?.address?.phone} onChange={handleChange}
                            error={get(touched, 'address.phone', false) && Boolean(get(errors, 'address.phone'))}
                            helperText={get(touched, 'address.phone', false) && get(errors, 'address.phone')}
                        />
                    </Grid>
                </Grid>
            </Container>
        </form>
    );
};

export default CreateUpdateSupplier;
