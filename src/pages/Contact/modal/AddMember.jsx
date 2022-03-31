import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Grid } from "@material-ui/core";
import { TextField } from "components";
import { useFormik } from "formik";
import { Member_Validation } from "shared/utilities/validationSchema.util";
import { Member } from "shared/models";
import { postMemberInvite } from "shared/services";
import { useHttp } from "hooks";

const AddMember = ({ onOpen, onClose, history }) => {
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
        const payload = { member: values };
        try {
            handleClose();
            const requestConfig = postMemberInvite(payload);
            await requestHandler(requestConfig, { loader: true });
            notify({ msg: 'Invitation has been sent successfully!!', type: 'success' });
            history.go('/contacts');
        } catch (e) {
            notify({ msg: 'Not able to send Invite. Something went wrong!!', type: 'error' });
        }
    };

    const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
        initialValues: member,
        validationSchema: Member_Validation,
        onSubmit: onConfirm
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Button type="submit" size="small" color="primary" variant="contained" onClick={handleClickOpen}>Add Members</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Invite User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the EMAIL-ID to send invite.
                        </DialogContentText>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2} alignItems={"center"}>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>Name</Typography>
                                        <TextField
                                            id="name"
                                            value={values.name} onChange={handleChange}
                                            error={touched.name}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>Email</Typography>
                                        <TextField
                                            id="email"
                                            value={values.email} onChange={handleChange}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>Role: " project_admin, project_member "</Typography>
                                        <TextField
                                            id="role"
                                            value={values.role} onChange={handleChange}
                                            error={touched.role && Boolean(errors.role)}
                                            helperText={touched.role && errors.role}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button  type="submit" color="primary" onClick={onConfirm}>Send Invite</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    );
};

export default AddMember;
