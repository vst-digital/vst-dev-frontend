import {Button, Dialog, DialogActions, DialogTitle, Typography} from "@material-ui/core";

const ConfirmModal = ({onCancel, onConfirm}) => {

    return (
        <Dialog id={"confirm_delete_field_modal"} open={true} fullWidth maxWidth="xs" onClose={onCancel}>
            <DialogTitle>
                <Typography variant={"h4"}>Are you want to delete?</Typography>
            </DialogTitle>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onConfirm}>Confirm</Button>
                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );

};

export default ConfirmModal;
