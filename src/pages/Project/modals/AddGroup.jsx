import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@material-ui/core";
import { AsyncSelect } from "components";
import { useFormik } from "formik";
import { Project_Validation } from "shared/utilities/validationSchema.util";
import { Group } from "shared/models";
import { postProjectGroupAssign, getGroups } from "shared/services";
import { useHttp } from "hooks";
import {
    getSelectDataSource,
    getGroupLabel,
} from "shared/utilities/common.util";

const AddGroup = ({ onOpen, onClose, history, location }) => {
    const [open, setOpen] = React.useState(false);
    const group = new Group();
    const { notify, requestHandler } = useHttp();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onConfirm = async () => {
        const payload = { group_id: values.id };
        try {
            const id = location.state.project.id;
            const requestConfig = postProjectGroupAssign(id, payload);
            await requestHandler(requestConfig, { loader: true });
            handleClose();
            notify({ msg: 'User has been Added successfully!!', type: 'success' });
            history.push('/projects');
        } catch (e) {
            notify({ msg: 'Not able to send Invite. Something went wrong!!', type: 'error' });
        }
    };

    const onGroupChange = (group_instance) => {
        const group = new Group(group_instance);
        setValues(group);
    };

    const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
        initialValues: group,
        validationSchema: Project_Validation,
        onSubmit: onConfirm
    });

    const getGroupList = () => new Promise((resolve, reject) => {
        const params = {per_page: 500, page_no: 1, sort: 'created_at.desc'};
        getSelectDataSource(requestHandler, getGroups(params))
            .then(res => resolve(res.data))
            .catch(error => reject(error));
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Button type="submit" size="small" color="primary" variant="contained" onClick={handleClickOpen}>Add Group</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Group</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the name of the Group.
                        </DialogContentText>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <AsyncSelect
                                    id={"groups"}
                                    getOptionLabel={getGroupLabel}
                                    loadingMethod={getGroupList}
                                    value={values.groups}
                                    onChange={onGroupChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" color="primary" onClick={onConfirm}>Add Group</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    );
};

export default AddGroup;
