import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";

import {TextField} from "components";

const AddFieldModal = ({title, fieldName = '', onCancel, onConfirm}) => {

    const [name, setName] = useState(fieldName);

    return (
        <Dialog id={"add_field_modal"} open={true} fullWidth maxWidth="xs" onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Name" autoFocus value={name} onChange={e => setName(e.target.value)}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => onConfirm(name)}>Save</Button>
                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );

};

export default AddFieldModal;
