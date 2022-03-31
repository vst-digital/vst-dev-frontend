import {forwardRef} from "react";
import MuiTextField from "@material-ui/core/TextField";
import {FIELD_SIZE} from "shared/utilities/constant";

const TextField = forwardRef(({variant = 'outlined', size = FIELD_SIZE, fullwidth = true, ...rest}, ref) => (
    <MuiTextField
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullwidth}
        autoComplete={"new-password"}
        {...rest}
    />
));

export default TextField;
