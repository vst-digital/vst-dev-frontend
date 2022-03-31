import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspaceRounded"

import {Container} from "components";

const ViewSite = ({history, location}) => {
    const selectedItem = location.state.selectedItem;

    const onClose = () => history.push('/site');

    return (
        <Container title="View Site" paper actions={
            <Button variant="outlined" onClick={onClose} startIcon={<KeyboardBackspaceIcon/>}>Back</Button>
        }>
            {selectedItem && <Grid container spacing={2} alignItems={"center"}>

            </Grid>}
        </Container>
    );
};

export default ViewSite;
