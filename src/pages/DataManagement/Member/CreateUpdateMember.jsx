import {Fragment} from "react";
import find from "lodash/find";
import {useFormik} from "formik";
import {useDropzone} from "react-dropzone";
import {
    Button,
    Grid,
    IconButton,
    InputLabel,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@material-ui/core";
import {DatePicker} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CloudUpload from "@material-ui/icons/CloudUpload";
import AttachFile from "@material-ui/icons/AttachFile";
import DeleteIcon from "@material-ui/icons/Delete";

import {useHttp} from "hooks";
import {Container, Panel, RowDivider, Section, TextField} from "components";
import {deleteAttachment, postAttachment, postMember, putMember, s3Uploader} from "shared/services";
import {Member} from "shared/models";
import {FIELD_SIZE} from "shared/utilities/constant";
import {COUNTRIES, EMPLOYMENT_STATUS, MEMBER_ROLE} from "shared/utilities/referenceData.util";
import {errorMessage, hasError} from "shared/utilities/common.util";
import {MEMBER} from "shared/utilities/validationSchema.util";

const CreateUpdateMember = ({history, location}) => {
    const {action = 'Add', member} = location.state.data;
    const {notify, requestHandler} = useHttp();

    const getDropzoneOptions = (fileType, multiple = false) => ({
        noDrag: true, multiple, onDrop: (files) => onDrop(files, fileType, multiple)
    });

    const fileType = [
        {
            id: 'profile_picture',
            label: 'Profile Picture',
            multiple: false,
            option: useDropzone(getDropzoneOptions('profile_picture'))
        },
        {
            id: 'driver_license',
            label: 'Driver License',
            multiple: false,
            option: useDropzone(getDropzoneOptions('driver_license'))
        },
        {
            id: 'medical_attachments',
            label: 'Medical Slips',
            multiple: true,
            option: useDropzone(getDropzoneOptions('medical_attachments', true))
        },
        {
            id: 'passport_attachments',
            label: 'Passport',
            multiple: true,
            option: useDropzone(getDropzoneOptions('passport_attachments', true))
        },
        {
            id: 'pdp_attachment',
            label: 'PDP',
            multiple: false,
            option: useDropzone(getDropzoneOptions('pdp_attachment'))
        },
        {
            id: 'national_id_attachment',
            label: 'National ID',
            multiple: false,
            option: useDropzone(getDropzoneOptions('national_id_attachment'))
        },
        {
            id: 'id_card_attachment',
            label: 'ID Card',
            multiple: false,
            option: useDropzone(getDropzoneOptions('id_card_attachment'))
        }
    ];

    const onDrop = (files, type, multiple) => {
        if (files && files.length) {
            const fileDataPromisesList = [];
            files.forEach(file => {
                const {name, size: file_size, type: content_type} = file;
                const payload = {attachment: {name, content_type, file_size}};
                fileDataPromisesList.push(new Promise((resolve, reject) => {
                    postAttachment(payload).then(res => {
                        const {post_fields} = res.data;
                        let formData = new FormData();
                        Object.keys(post_fields).forEach(key => formData.append(key, post_fields[key]));
                        formData.append('file', files[0]);
                        s3Uploader(formData);
                        resolve(res.data);
                    }).catch(e => reject(payload));
                }));
            });

            Promise.allSettled(fileDataPromisesList).then(results => {
                const fileList = [];
                results.forEach(result => result.status === 'fulfilled' && fileList.push(result.value));
                const m = new Member(values);
                m[type] = multiple ? [...m[type], ...fileList] : fileList[0];
                setValues(m);
            });
        }
    };

    const onFileDelete = (type, id) => {
        const {id: fileType, multiple} = type;
        deleteAttachment(id).then(res => {
            const m = new Member(values);
            m[fileType] = multiple ? m[fileType].filter(file => file.id !== id) : null;
            setValues(m);
        }).catch(e => console.error(e));
    };

    const getFiles = (files, type) => {
        let result = null;
        if (type.multiple) {
            if (files && files.length) {
                result = (
                    <List dense>
                        {files.map(file => (
                            <ListItem key={file.id} disableGutters>
                                <ListItemIcon style={{minWidth: 40}}><AttachFile fontSize="small"/></ListItemIcon>

                                <ListItemText>
                                    <Typography variant={"body1"}>
                                        <Link href={file.signed_url}>{file.name} - {file.file_size} bytes</Link>
                                    </Typography>
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => onFileDelete(type, file.id)}>
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                );
            }
        } else {
            if (files) {
                result = (
                    <List dense>
                        <ListItem key={files.id} disableGutters>
                            <ListItemIcon style={{minWidth: 40}}><AttachFile fontSize="small"/></ListItemIcon>
                            <ListItemText>
                                <Typography variant={"body1"}>
                                    <Link href={files.signed_url}>{files.name} - {files.file_size} bytes</Link>
                                </Typography>
                            </ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => onFileDelete(type, files.id)}>
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                );
            }
        }
        return result;
    };

    const onClose = () => history.push('/member');

    const onConfirm = async (values) => {
        const payload = {member: {...values}};
        (action !== 'Add') && delete payload.member['login'];
        try {
            const requestConfig = (action === 'Add') ? postMember(payload) : putMember(values.id, payload);
            await requestHandler(requestConfig, {loader: true});
            notify({msg: 'Member has been saved successfully!!', type: 'success'});
            history.push('/member');
        } catch (e) {
            if (e.response.status === 422) {
                setErrors(e.response.data.errors);
            } else {
                notify({msg: 'Not able to save member. Something went wrong!!', type: 'error'});
            }
        }
    };

    const {values, touched, errors, handleChange, handleSubmit, setFieldValue, setValues, setErrors} = useFormik({
        initialValues: member,
        validationSchema: MEMBER,
        onSubmit: onConfirm
    });

    return (
        <form onSubmit={handleSubmit}>
            <Container title={`${action} Member`} actions={
                <>
                    <Button type="submit" color="primary" variant="contained">Save</Button>
                    <Button variant="contained" onClick={onClose}>Cancel</Button>
                </>
            }>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Panel title="Employment Details">
                            <Grid container spacing={2} alignItems={"center"}>
                                <Grid item xs={2}><InputLabel htmlFor="employee_id">Employee ID</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="employee_id"
                                        value={values.employee_id} onChange={handleChange}
                                        error={hasError('employee_id', touched, errors)}
                                        helperText={errorMessage('employee_id', touched, errors)}
                                    />
                                </Grid>
                                <Grid item xs={2}><InputLabel htmlFor="status">Employment Status</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        id="status" options={EMPLOYMENT_STATUS}
                                        getOptionLabel={option => option.label + ''}
                                        renderInput={params => <TextField
                                            {...params}
                                            error={hasError('status', touched, errors)}
                                            helperText={errorMessage('status', touched, errors)}
                                        />}
                                        value={find(EMPLOYMENT_STATUS, {value: values.status})}
                                        onChange={(_, newVal) => setFieldValue('status', newVal.value)}
                                    />
                                </Grid>

                                <Grid item xs={2}><InputLabel htmlFor="first_name">First Name</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="first_name" value={values.first_name} onChange={handleChange}
                                        error={hasError('first_name', touched, errors)}
                                        helperText={errorMessage('first_name', touched, errors)}
                                    />
                                </Grid>
                                <Grid item xs={2}><InputLabel htmlFor="last_name">Last Name</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField id="last_name" value={values.last_name} onChange={handleChange}/>
                                </Grid>

                                <Grid item xs={2}><InputLabel htmlFor="email">Email</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="email" value={values.email} onChange={handleChange}
                                        error={hasError('email', touched, errors)}
                                        helperText={errorMessage('email', touched, errors)}
                                    />
                                </Grid>
                                <Grid item xs={2}><InputLabel htmlFor="mobile_number">Mobile Number</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField id="mobile_number" value={values.mobile_number} onChange={handleChange}/>
                                </Grid>

                                <Grid item xs={2}><InputLabel htmlFor="nationality">Nationality</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        id="nationality" options={COUNTRIES}
                                        getOptionLabel={option => option.label + ''}
                                        renderInput={params => <TextField
                                            {...params}
                                            error={touched.condition && !!errors.condition}
                                            helperText={touched.condition && errors.condition}
                                        />}
                                        value={find(COUNTRIES, {value: values.nationality})}
                                        onChange={(_, newVal) => setFieldValue('nationality', newVal.value)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="identification_number">Identification No.</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="identification_number"
                                        value={values.identification_number} onChange={handleChange}
                                        error={hasError('identification_number', touched, errors)}
                                        helperText={errorMessage('identification_number', touched, errors)}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="residential_status">Residential Status</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="residential_status"
                                        value={values.residential_status}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}><InputLabel htmlFor="role">Role</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        id="role" options={MEMBER_ROLE}
                                        getOptionLabel={option => option.label + ''}
                                        renderInput={params => <TextField
                                            {...params}
                                            error={hasError('role', touched, errors)}
                                            helperText={errorMessage('role', touched, errors)}
                                        />}
                                        value={find(MEMBER_ROLE, {value: values.role})}
                                        onChange={(_, newVal) => setFieldValue('role', newVal.value)}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="employment_start_date">Start Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="employment_start_date" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth value={values.employment_start_date}
                                        onChange={value => setFieldValue('employment_start_date', value)}
                                        error={hasError('employment_start_date', touched, errors)}
                                        helperText={errorMessage('employment_start_date', touched, errors)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="employment_end_date">End Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="employment_end_date" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth
                                        value={values.employment_end_date}
                                        onChange={value => setFieldValue('employment_end_date', value)}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="passport_number">Passport Number</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="passport_number"
                                        value={values.passport_number}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="passport_end_date">Passport Expiry Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="passport_end_date" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth
                                        value={values.passport_end_date}
                                        onChange={value => setFieldValue('passport_end_date', value)}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="driving_license_number">License Number</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="driving_license_number"
                                        value={values.driving_license_number}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="driving_license_expiry_date">License Expiry Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="driving_license_expiry_date" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth
                                        value={values.driving_license_expiry_date}
                                        onChange={value => setFieldValue('driving_license_expiry_date', value)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="pdp_expiry">PDP/IDP Expiry Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="pdp_expiry" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth
                                        value={values.pdp_expiry}
                                        onChange={value => setFieldValue('pdp_expiry', value)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="work_permit_end_date">Work Permit Expiry Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="work_permit_end_date" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth
                                        value={values.work_permit_end_date}
                                        onChange={value => setFieldValue('work_permit_end_date', value)}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="medical_expiry_date">Medical Expiry Date</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePicker
                                        id="medical_expiry_date" autoOk
                                        variant="inline" inputVariant="outlined"
                                        size={FIELD_SIZE} fullWidth
                                        value={values.medical_expiry_date}
                                        onChange={value => setFieldValue('medical_expiry_date', value)}
                                    />
                                </Grid>

                                <Grid item xs={12}><Section title="Address"/></Grid>
                                <Grid item xs={2}><InputLabel htmlFor="address.house_number">H.No.</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.house_number"
                                        value={values.address?.house_number}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="address.street_name">Street Name</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.street_name"
                                        value={values.address?.street_name}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="address.suburb">Town</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.suburb"
                                        value={values.address?.suburb}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="address.province">Province</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.province"
                                        value={values.address?.province}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="address.city">City</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.city"
                                        value={values.address?.city}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="address.country">Country</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.country"
                                        value={values.address?.country}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="address.zipcode">Zipcode</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="address.zipcode"
                                        value={values.address?.zipcode}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12}><Section title="Upload Documents"/></Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems={"center"}>
                                        {fileType.map((type, i) => <Fragment key={i}>
                                            <Grid item xs={12}>
                                                <span {...type.option.getRootProps()}>
                                                    <input
                                                        {...type.option.getInputProps()}
                                                        disabled={!type.multiple && !!values[type.id]}
                                                    />
                                                    <Button
                                                        startIcon={<CloudUpload/>}
                                                        disabled={!type.multiple && !!values[type.id]}
                                                    >
                                                        Upload {type.label}
                                                    </Button>
                                                </span>
                                                {getFiles(values[type.id], type)}
                                            </Grid>
                                            {i < (fileType.length - 1) && <RowDivider/>}
                                        </Fragment>)}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Panel>
                    </Grid>

                    <Grid item xs={12}>
                        <Panel title="Login Information">
                            <Grid container spacing={2} alignItems={"center"}>
                                {/*<Grid item xs={12}><Section title="Login Information"/></Grid>*/}
                                <Grid item xs={2}><InputLabel htmlFor="login.username">Username</InputLabel></Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="login.username"
                                        value={values.login.username} onChange={handleChange}
                                        error={hasError('login.username', touched, errors)}
                                        helperText={errorMessage('login.username', touched, errors)}
                                    />
                                </Grid>

                                {values.id === '' && <>
                                    <Grid item xs={2}><InputLabel htmlFor="login.password">Password</InputLabel></Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            id="login.password" type="password"
                                            value={values.login.password} onChange={handleChange}
                                            error={hasError('login.password', touched, errors)}
                                            helperText={errorMessage('login.password', touched, errors)}
                                        />
                                    </Grid>

                                    <Grid item xs={2}>
                                        <InputLabel htmlFor="login.password_confirmation">Confirm Password</InputLabel>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            id="login.password_confirmation" type="password"
                                            value={values.login.password_confirmation} onChange={handleChange}
                                            error={hasError('login.password_confirmation', touched, errors)}
                                            helperText={errorMessage('login.password_confirmation', touched, errors)}
                                        />
                                    </Grid>
                                </>}
                            </Grid>
                        </Panel>
                    </Grid>

                    <Grid item xs={12}>
                        <Panel title="Bank Details">
                            <Grid container spacing={2} alignItems={"center"}>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="bank_account_details.bank_name">Bank Name</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="bank_account_details.bank_name"
                                        value={values.bank_account_details.bank_name} onChange={handleChange}
                                        error={hasError('bank_account_details.bank_name', touched, errors)}
                                        helperText={errorMessage('bank_account_details.bank_name', touched, errors)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="bank_account_details.account_number">
                                        Account Number
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="bank_account_details.account_number"
                                        value={values.bank_account_details.account_number} onChange={handleChange}
                                        error={hasError('bank_account_details.account_number', touched, errors)}
                                        helperText={errorMessage('bank_account_details.account_number', touched, errors)}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="bank_account_details.branch_name">Branch Name</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="bank_account_details.branch_name"
                                        value={values.bank_account_details.branch_name} onChange={handleChange}
                                        error={hasError('bank_account_details.branch_name', touched, errors)}
                                        helperText={errorMessage('bank_account_details.branch_name', touched, errors)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="bank_account_details.branch_code">Branch Code</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="bank_account_details.branch_code"
                                        value={values.bank_account_details.branch_code} onChange={handleChange}
                                        error={hasError('bank_account_details.branch_code', touched, errors)}
                                        helperText={errorMessage('bank_account_details.branch_code', touched, errors)}
                                    />
                                </Grid>
                            </Grid>
                        </Panel>
                    </Grid>

                    <Grid item xs={12}>
                        <Panel title="Relative Details">
                            <Grid container spacing={2} alignItems={"center"}>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.relative_first_name">First Name</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.relative_first_name"
                                        value={values.relative_details.relative_first_name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.relative_last_name">Last Name</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.relative_last_name"
                                        value={values.relative_details.relative_last_name}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.relative_phone_number">Phone No.</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.relative_phone_number"
                                        value={values.relative_details.relative_phone_number}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.relative_relationship_type">
                                        Relation
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.relative_relationship_type"
                                        value={values.relative_details.relative_relationship_type}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12}><Section title="Address"/></Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.house_number">H.No.</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.house_number"
                                        value={values.relative_details.address?.house_number}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.street_name">Street Name</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.street_name"
                                        value={values.relative_details.address?.street_name}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.suburb">Town</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.suburb"
                                        value={values.relative_details.address?.suburb}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.province">Province</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.province"
                                        value={values.relative_details.address?.province}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.city">City</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.city"
                                        value={values.relative_details.address?.city}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.country">Country</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.country"
                                        value={values.relative_details.address?.country}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel htmlFor="relative_details.address.zipcode">Zipcode</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="relative_details.address.zipcode"
                                        value={values.relative_details.address?.zipcode}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </Panel>
                    </Grid>
                </Grid>
            </Container>
        </form>
    );
};

export default CreateUpdateMember;
