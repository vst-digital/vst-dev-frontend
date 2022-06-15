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
  Typography,
} from "@material-ui/core";
import LockOutlined from "@material-ui/icons/LockOutlined";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOffRounded";
import VisibilityIcon from "@material-ui/icons/VisibilityRounded";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { Alert, TextField } from "components";
import { useHttp } from "hooks";
import { SIGN_IN } from "shared/utilities/validationSchema.util";
import { authFailure } from "store/actions/auth.actions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: "100vh",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: { margin: theme.spacing(2, 0) },
  link_signUp: {
    "&:link, &:visited, &:active": {
      ...theme.typography.body2,
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
    "&:hover": { textDecoration: "underline" },
  },
}));

const SignIn = ({ history }) => {
  const classes = useStyles();
  const { notify } = useHttp();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const onSubmit = async () => {
    setNotification({ show: false, type: "", message: "" });
    const { username, password } = values;
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios
        .post(process.env.REACT_APP_AUTH_API_BASE_URL, {
          user: {
            email: username,
            password: password,
          },
        })
        .then(function (response) {
          // const expirationTime = new Date(new Date().getTime() + (expires_in - 60) * 1000);
          localStorage.setItem("token", response.headers["authorization"]);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("user_id", response.data.user.id);
          localStorage.setItem("user_name", response.data.user.first_name);
          localStorage.setItem(
            "initials",
            response.data.user.first_name.slice(0, 2)
          );
          localStorage.setItem("expirationTime", 30000000);
          history.push("/home");
          history.go("/home");
        })
        .catch(function (error) {
          // TODO: The error handling must be moved to a common axios interceptors file.
          // There is a file already made for that in services but it needs some Work.

          console.log(error);
          const params = {
            show: true,
            originVertical: "top",
            originHorizontal: "center",
            type: "error",
            message: error?.response?.data || "Something went wrong",
          };

          notify({ ...params });
        });
    } catch (e) {
      dispatch(authFailure());
      notify({ msg: "Username or Password is incorrect", type: "error" });
    }
  };

  const { values, touched, errors, handleSubmit, handleChange } = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: SIGN_IN,
    onSubmit: onSubmit,
  });

  return (
    <Container component="section" maxWidth="xs">
      <Paper elevation={4} className={classes.paper}>
        <Alert {...notification} />

        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>

        <Typography variant="h5">Sign in</Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            id="username"
            label="Username"
            margin="normal"
            size="medium"
            value={values.username}
            onChange={handleChange}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </InputAdornment>
              ),
            }}
            value={values.password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body1">
                Forgot password?
              </Link>
            </Grid>
            {/* <Grid item>
                            <Link href="#" variant="body1">Don't have an account? Sign Up</Link>
                        </Grid> */}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
