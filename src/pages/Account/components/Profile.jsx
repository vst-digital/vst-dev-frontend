import Grid from "@material-ui/core/Grid";

import {DisplayField, Panel, RowDivider} from "components";

const Profile = () => {

    return (
        <Panel title="User Profile">
            <Grid container spacing={2}>
                <DisplayField width={6} label="Location" value="India"/>
                <RowDivider/>

                <DisplayField width={6} label="Company Name" value="Demo LTD."/>
                <RowDivider/>

                <DisplayField width={6} label="Company Address" value="India"/>
                <RowDivider/>

                <DisplayField width={6} label="Contact Number" value="+91 - 9123456780"/>
                <RowDivider/>

                <DisplayField width={6} label="Country" value="India"/>
                <RowDivider/>

                <DisplayField width={6} label="Admin Name" value="Saurabh Gulati"/>
                <RowDivider/>
            </Grid>
        </Panel>
    );
};

export default Profile;
