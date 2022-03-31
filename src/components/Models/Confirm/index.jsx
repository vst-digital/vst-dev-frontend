import {Button, Dialog, DialogActions, DialogContent, Typography} from "@material-ui/core";

const Confirm = ({open, close, title}) => {
    const onCancel = () => close(false);

    const onConfirm = () => close(true);

    return (
        <Dialog id="confirm-modal" maxWidth="xs" open={open} onClose={onCancel}>
            <DialogContent>
                <Typography variant={"h4"}>{title}</Typography>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onConfirm}>Yes</Button>
                <Button color="secondary" onClick={onCancel}>No</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Confirm;
