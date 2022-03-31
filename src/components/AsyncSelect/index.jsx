import {useEffect, useState} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {FIELD_SIZE} from "../../shared/utilities/constant";

const AsyncSelect = (props) => {
    const {id, label, variant, value, defaultValue, error, helperText, loadingMethod, getOptionLabel, onChange, ...rest} = props;
    const [isOpen, toggleOpen] = useState(false);
    const [isLoading, toggleLoading] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (value) {
            loadingMethod().then(res => setOptions(res)).catch(error => console.error(error));
        }
    }, []);

    useEffect(() => {
        if((isOpen && !isLoading && !options.length) || (isOpen && rest.alwaysFetch)) {
            toggleLoading(true);
            loadingMethod().then(res => {
                toggleLoading(false);
                setOptions(res);
            }).catch(error => {
                console.error(error);
                toggleLoading(false);
                setOptions([]);
            });
        }
    }, [isOpen]);

    const onOpenMenu = () => toggleOpen(true);

    const onCloseMenu = () => {
        toggleOpen(false);
        rest.alwaysFetch && setOptions([]);
    };

    return (
        <Autocomplete
            id={id} open={isOpen} size={FIELD_SIZE}
            onOpen={onOpenMenu} onClose={onCloseMenu}
            loading={isLoading} options={options}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant={variant || "outlined"}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    error={error} helperText={helperText}
                />
            )}
            defaultValue={defaultValue} value={value}
            onChange={(e, newValue) => onChange(newValue)}
            {...rest}
        />
    );
};

export default AsyncSelect;
