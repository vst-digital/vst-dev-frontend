import Grid from "@material-ui/core/Grid";

import {Container} from "components";
import {CONFIG_FIELD_TYPE} from "shared/utilities/constant";
import ConfigList from "./components/ConfigList";


const CONFIG_LIST = [
    {title: 'Vehicle - Business Unit', type: CONFIG_FIELD_TYPE.BUSINESS_UNIT},
    {title: 'Vehicle - Category', type: CONFIG_FIELD_TYPE.VEHICLE_CATEGORY},
    {title: 'Vehicle - Depo', type: CONFIG_FIELD_TYPE.VEHICLE_DEPO},
    {title: 'Parts Inventory - Type', type: CONFIG_FIELD_TYPE.PART_INVENTORY_TYPE},
    {title: 'Trailer - Category', type: CONFIG_FIELD_TYPE.TRAILER_CATEGORY},
    {title: 'Planning - Contractor', type: CONFIG_FIELD_TYPE.ROUTE_PLANNER_CONTRACTOR}
];

const Configuration = () => (
    <Container title="Configuration">
        <Grid container spacing={2}>
            {CONFIG_LIST.map(item => <Grid key={item.type} item xs={4}>
                <ConfigList title={item.title} type={item.type}/>
            </Grid>)}
        </Grid>
    </Container>
);

export default Configuration;
