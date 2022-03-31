import {Button, Chip, Grid, Link, Typography} from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspaceRounded"

import {Container, DisplayField, Panel, RowDivider, Section} from "components";
import {Member} from "shared/models";
import {COUNTRIES, EMPLOYMENT_STATUS, MEMBER_ROLE} from "shared/utilities/referenceData.util";
import {formatDate, getOptionLabel} from "shared/utilities/common.util";

const addressString = (address) => {
    let result = '';
    if (address) {
        const arr = [
            address.house_number,
            address.street_name,
            address.suburb,
            address.province,
            address.city,
            address.country,
            address.zipcode
        ]
        result = arr.filter(item => !!item).join(", ");
    }
    return result;
}

const ViewMember = ({history, location}) => {
    const selectedItem = new Member(location.state.member);

    const getFileLink = (fileType, multiple = false) => {
        let result = <Chip label="No File Uploaded" variant="outlined" size="small"/>
        const files = selectedItem[fileType];
        if (multiple) {
            if (files && files.length) {
                result = files.map(file => (<Link
                    id={file.id}
                    href={file.signed_url}
                    style={{display: 'block'}}
                >
                    {file.name}
                </Link>))
            }
        } else {
            if (files) {
                result = <Link id={files.id} href={files.signed_url}>{files.name}</Link>
            }
        }
        return result;
    };

    const onClose = () => history.push('/member');

    return (
        <Container title="View Member" actions={
            <Button variant="outlined" onClick={onClose} startIcon={<KeyboardBackspaceIcon/>}>Back</Button>
        }>
            {selectedItem && <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Panel title="Employment Details">
                        <Grid container spacing={2} alignItems={"center"}>
                            <DisplayField label={"Employee ID"} value={selectedItem.employee_id}/>
                            <DisplayField
                                label={"Employment Status"}
                                value={getOptionLabel(EMPLOYMENT_STATUS, selectedItem.status)}
                            />

                            <DisplayField label={"First Name"} value={selectedItem.first_name}/>
                            <DisplayField label={"Last Name"} value={selectedItem.last_name}/>

                            <DisplayField label={"Email"} value={selectedItem.email}/>
                            <DisplayField label={"Mobile Number"} value={selectedItem.mobile_number}/>

                            <DisplayField
                                label={"Nationality"}
                                value={getOptionLabel(COUNTRIES, selectedItem.status)}
                            />
                            <DisplayField
                                label={"Identification No."}
                                value={selectedItem.identification_number}
                            />

                            <DisplayField label={"Residential Status"} value={selectedItem.residential_status}/>
                            <DisplayField
                                label={"Role"}
                                value={getOptionLabel(MEMBER_ROLE, selectedItem.role)}
                            />

                            <DisplayField
                                label={"Start Date"}
                                value={formatDate(selectedItem.employment_start_date)}
                            />
                            <DisplayField
                                label={"End Date"}
                                value={formatDate(selectedItem.employment_end_date)}
                            />

                            <DisplayField label={"Passport Number"} value={selectedItem.passport_number}/>
                            <DisplayField
                                label={"Passport Expiry Date"}
                                value={formatDate(selectedItem.passport_end_date)}
                            />

                            <DisplayField label={"License Number"} value={selectedItem.driving_license_number}/>
                            <DisplayField
                                label={"License Expiry Date"}
                                value={formatDate(selectedItem.driving_license_expiry_date)}
                            />

                            <DisplayField
                                label={"PDP/IDP Expiry Date"}
                                value={formatDate(selectedItem.pdp_expiry)}
                            />
                            <DisplayField
                                label={"Work Permit Expiry Date"}
                                value={formatDate(selectedItem.work_permit_end_date)}
                            />

                            <DisplayField
                                label={"Medical Expiry Date"}
                                value={formatDate(selectedItem.medical_expiry_date)}
                            />
                            <DisplayField
                                label={"Address"}
                                value={addressString(selectedItem.address)}
                            />

                            <Grid item xs={12}><Section title="Upload Documents"/></Grid>
                            <Grid item xs={6}><Typography variant="subtitle1">Profile Picture</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('profile_picture')}</Grid>
                            <RowDivider/>

                            <Grid item xs={6}><Typography variant="subtitle1">Driver License</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('driver_license')}</Grid>
                            <RowDivider/>

                            <Grid item xs={6}><Typography variant="subtitle1">Medical Slips</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('medical_attachments', true)}</Grid>
                            <RowDivider/>

                            <Grid item xs={6}><Typography variant="subtitle1">Passport</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('passport_attachments', true)}</Grid>
                            <RowDivider/>

                            <Grid item xs={6}><Typography variant="subtitle1">PDP</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('pdp_attachment')}</Grid>
                            <RowDivider/>

                            <Grid item xs={6}><Typography variant="subtitle1">National ID</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('national_id_attachment')}</Grid>
                            <RowDivider/>

                            <Grid item xs={6}><Typography variant="subtitle1">ID Card</Typography></Grid>
                            <Grid item xs={6}>{getFileLink('id_card_attachment')}</Grid>
                        </Grid>
                    </Panel>
                </Grid>

                <Grid item xs={12}>
                    <Panel title="Login Information">
                        <Grid container spacing={2} alignItems={"center"}>
                            <DisplayField label={"Username"} value={selectedItem?.login.username}/>
                        </Grid>
                    </Panel>
                </Grid>

                <Grid item xs={12}>
                    <Panel title="Bank Details">
                        <Grid container spacing={2} alignItems={"center"}>
                            <DisplayField
                                label={"Bank Name"}
                                value={selectedItem?.bank_account_details?.bank_name}
                            />

                            <DisplayField
                                label={"Account Number"}
                                value={selectedItem?.bank_account_details?.account_number}
                            />

                            <DisplayField
                                label={"Branch Name"}
                                value={selectedItem?.bank_account_details?.branch_name}
                            />

                            <DisplayField
                                label={"Branch Code"}
                                value={selectedItem?.bank_account_details?.branch_code}
                            />
                        </Grid>
                    </Panel>
                </Grid>

                <Grid item xs={12}>
                    <Panel title="Relative Details">
                        <Grid container spacing={2} alignItems={"center"}>
                            <DisplayField
                                label={"First Name"}
                                value={selectedItem?.relative_details?.relative_first_name}
                            />
                            <DisplayField
                                label={"Last Name"}
                                value={selectedItem?.relative_details?.relative_last_name}
                            />
                            <DisplayField
                                label={"Phone No."}
                                value={selectedItem?.relative_details?.relative_phone_number}
                            />
                            <DisplayField
                                label={"Relation"}
                                value={selectedItem?.relative_details?.relative_relationship_type}
                            />
                            <DisplayField
                                label={"Address"}
                                value={addressString(selectedItem.relative_details.address)}
                            />

                        </Grid>
                    </Panel>
                </Grid>
            </Grid>}
        </Container>
    );
};

export default ViewMember;