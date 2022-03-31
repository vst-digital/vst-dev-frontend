import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import {Container} from "components";

const AddSite = ({history}) => {
    const onClose = () => history.push('/site');

    const onConfirm = () => history.push('/site');

    return (
        <Container title="Add Site" paper actions={
            <>
                <Button color="primary" variant="contained" onClick={onConfirm}>Add</Button>
                <Button variant="contained" onClick={onClose}>Cancel</Button>
            </>
        }>
            <Grid container spacing={2} alignItems={"center"}>

            </Grid>
        </Container>
    );
};

export default AddSite;
