import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const DisplayField = ({label, value, width = 3, labelWidth, valueWidth}) => {
    return (
        <>
            <Grid item xs={labelWidth ? labelWidth : width}>
                <Typography variant="subtitle1">{label}</Typography>
            </Grid>
            <Grid item xs={valueWidth ? valueWidth : width}>
                <Typography variant="h6">{value}</Typography>
            </Grid>
        </>
    );
}

export default DisplayField;
