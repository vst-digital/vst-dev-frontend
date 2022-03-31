import Button from "@material-ui/core/Button";
import AddRounded from "@material-ui/icons/AddRounded";

import {Container, Table} from "components";

const ViewAllSite = ({history, location}) => {

    const onAddClick = () => history.push(`${location.pathname}/new`);

    const onRowClick = (selectedItem) => {
        if (selectedItem) {
            history.push(`${location.pathname}/${selectedItem.id}/view`, {selectedItem});
        }
    };

    return (
        <Container title="Site/Project List" actions={
            <Button variant="contained" color="primary" startIcon={<AddRounded/>} onClick={onAddClick}>
                Add Site
            </Button>
        }>
            <Table
                title={"Site List"}
                schema={[
                    {id: 'id', label: 'Id', sort: true},
                    {id: 'name', label: 'Name', sort: true},
                    {id: 'legalName', label: 'Legal Name', sort: true},
                    {id: 'division', label: 'Division', sort: true},
                    {id: 'manager', label: 'Manager', sort: true},
                    {id: 'dept', label: 'Department', sort: true},
                    {id: 'address', label: 'Address', sort: true},
                    {id: 'city', label: 'City', sort: true},
                    {id: 'country', label: 'Country', sort: true}
                ]}
                data={[]}
                onRowClick={onRowClick}
            />
        </Container>
    );
};

export default ViewAllSite;
