import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspaceRounded"

import {Container, DisplayField, RowDivider, Section} from "components";

const ViewSupplier = ({history, location}) => {
    const selectedItem = location.state.data;

    const onClose = () => history.push('/supplier');

    return (
        <Container title="View Supplier" paper actions={
            <Button variant="outlined" onClick={onClose} startIcon={<KeyboardBackspaceIcon/>}>Back</Button>
        }>
            {selectedItem && <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={12}><Section title="Personal Details"/></Grid>
                <DisplayField label='Name' value={selectedItem?.name}/>
                <DisplayField label='Email' value={selectedItem?.email}/>
                <RowDivider/>

                <DisplayField label='Company Name' value={selectedItem?.company_name}/>
                <DisplayField label='Tax No.' value={selectedItem?.tax_number}/>

                <Grid item xs={12}><Section title="Bank Details"/></Grid>
                <DisplayField label='Account Holder Name' value={selectedItem?.bank_details?.name}/>
                <DisplayField label='Account No.' value={selectedItem?.bank_details?.account_number}/>
                <RowDivider/>

                <DisplayField label='Bank Name' value={selectedItem?.bank_details?.bank_name}/>
                <DisplayField label='Branch Code' value={selectedItem?.bank_details?.branch_code}/>

                <Grid item xs={12}><Section title="Address Details"/></Grid>
                <DisplayField label='Address Line 1' value={selectedItem?.address?.address1}/>
                <DisplayField label='Address Line 2' value={selectedItem?.address?.address2}/>
                <RowDivider/>

                <DisplayField label='City' value={selectedItem?.address?.city}/>
                <DisplayField label='State' value={selectedItem?.address?.state}/>
                <RowDivider/>

                <DisplayField label='Country' value={selectedItem?.address?.country}/>
                <DisplayField label='Phone no.' value={selectedItem?.address?.phone}/>
            </Grid>}
        </Container>
    );
};

export default ViewSupplier;
