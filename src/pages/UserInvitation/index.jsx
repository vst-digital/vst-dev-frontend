import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {
    Avatar,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    InputAdornment,
    Link,
    makeStyles,
    Paper,
    Typography
} from "@material-ui/core";
import LockOutlined from '@material-ui/icons/LockOutlined';
import VisibilityOffIcon from "@material-ui/icons/VisibilityOffRounded";
import VisibilityIcon from "@material-ui/icons/VisibilityRounded";

import { useHttp } from "hooks";
import { Alert, TextField } from "components";
import { signIn } from "shared/services";
import { authFailure, authSuccess, checkAuthTimeout } from "store/actions/auth.actions";
import { AcceptInvitation } from "shared/utilities/validationSchema.util";
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        height: '100vh'
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: { margin: theme.spacing(2, 0) },
    link_signUp: {
        '&:link, &:visited, &:active': {
            ...theme.typography.body2,
            textDecoration: 'none',
            color: theme.palette.primary.main
        },
        '&:hover': { textDecoration: 'underline' }
    }
}));

const UserInvitation = ({ history, props }) => {
    const classes = useStyles();
    const { notify, requestHandler } = useHttp();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const onSubmit = async () => {
        setNotification({ show: false, type: '', message: '' });
        const { token, password } = values;
        try {
            axios.defaults.headers['Content-Type'] = 'application/json'
            axios.defaults.headers["accept"] = 'application/javascript'
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/members/accept_invitation`, {
                member: {
                    invitation_token: token,
                    password: password
                }
            })
                .then(function (response) {
                    alert('Invitation Accepted')
                    history.push('/signIn')
                    history.go('/signIn')
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (e) {
            dispatch(authFailure());
            notify({ msg: 'Token is incorrect', type: 'error' });
        }
    };

    const { values, touched, errors, handleSubmit, handleChange } = useFormik({
        initialValues: { token: history.location.search.split('=')[1], password: '' },
        validationSchema: AcceptInvitation,
        onSubmit: onSubmit
    });

    return (
        <Container component="section" maxWidth="xs">
            <Paper elevation={4} className={classes.paper}>
                <Alert {...notification} />

                <Avatar className={classes.avatar}><LockOutlined /></Avatar>

                <Typography variant="h5">Accept Invitation</Typography>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        id="token" label="Token"
                        margin="normal" size="medium"
                        value={values.token} onChange={handleChange}
                        error={touched.token && Boolean(errors.token)}
                        helperText={touched.token && errors.token}
                    />
                    <TextField
                        id="password" label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal" size="medium"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </InputAdornment>
                            )
                        }}
                        value={values.password} onChange={handleChange}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                    />

                    <Button
                        type="submit" variant="contained"
                        fullWidth color="primary" className={classes.submit}
                    >
                        Accept Invitation
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default UserInvitation;
