import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Grid } from "@material-ui/core";
import { TextField, AsyncSelect } from "components";
import { useFormik } from "formik";
import { Member_Validation } from "shared/utilities/validationSchema.util";
import { Member } from "shared/models";
import { postGroupMemberAdd, getMembers } from "shared/services";
import { useHttp } from "hooks";
import { useState } from "react";
import {
    errorMessage,
    getMemberLabel,
    getFullName,
    getNumberRoundToOneDecimal,
    getOptionLabel,
    getSelectDataSource,
    hasError
} from "shared/utilities/common.util";


const AddMember = ({ onOpen, onClose, history, location }) => {
    const [open, setOpen] = React.useState(false);
    const member = new Member();
    const { notify, requestHandler } = useHttp();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onConfirm = async () => {
        const payload = { user_id: values.id };
        try {
            const id = location.state.group.id;
            const requestConfig = postGroupMemberAdd(id, payload);
            await requestHandler(requestConfig, { loader: true });
            handleClose();
            notify({ msg: 'User has been Added successfully!!', type: 'success' });
            history.push('/groups');
        } catch (e) {
            notify({ msg: 'Not able to send Invite. Something went wrong!!', type: 'error' });
        }
    };

    const onMemberChange = (member_instance) => {
        const member = new Member(member_instance);
        // member.route_order_actual_info.setFuelPoint(fuelPoint);
        setValues(member);
    };

    const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
        initialValues: member,
        validationSchema: Member_Validation,
        onSubmit: onConfirm
    });

    const getMembersList = () => new Promise((resolve, reject) => {
        const params = { per_page: 500, page_no: 1, sort: 'created_at.desc' };
        getSelectDataSource(requestHandler, getMembers(params))
            .then(res => resolve(res.data))
            .catch(error => reject(error));
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Button type="submit" size="small" color="primary" variant="contained" onClick={handleClickOpen}>Add Members</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Members</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the name to search.
                        </DialogContentText>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <AsyncSelect
                                    id={"members"}
                                    getOptionLabel={getMemberLabel}
                                    loadingMethod={getMembersList}
                                    value={values.users}
                                    onChange={onMemberChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" color="primary" onClick={onConfirm}>Add Member</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    );
};

export default AddMember;
