import typography from "../typography";
import grey from "@material-ui/core/colors/grey";

const MuiTableCell = {
    root: {
        ...typography.body1,
        borderBottom: `1px solid ${grey[300]}`
    }
};

const MuiTablePagination = {
    caption: {...typography.body1}
};

export {MuiTableCell, MuiTablePagination};
