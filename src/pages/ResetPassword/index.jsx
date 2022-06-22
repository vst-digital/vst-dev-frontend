import {
  Avatar,
  Button,
  Container,
  Paper,
  Typography,
} from "@material-ui/core";
import LockOutlined from "@material-ui/icons/LockOutlined";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";

import axios from "axios";
import { TextField } from "components";
import { useHttp } from "hooks";
import { PASSWORD_RECOVERY } from "shared/utilities/validationSchema.util";
import { authFailure } from "store/actions/auth.actions";

import { useLocation } from "react-router-dom";
import { useStyles } from "./Style";

const ResetPassword = () => {
  const classes = useStyles();
  const { notify } = useHttp();
  const dispatch = useDispatch();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const resetToken = params?.get("token");

  const onSubmit = async () => {
    const { password } = values;

    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios
        .put(process.env.REACT_APP_API_BASE_URL + "users/password", {
          user: {
            reset_password_token: resetToken,
            password: password,
          },
        })
        .then(function () {
          const params = {
            show: true,
            originVertical: "top",
            originHorizontal: "center",
            type: "success",
            message: "Password has been updated",
          };

          notify({ ...params });
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
            message:
              error?.response?.data?.error ||
              error?.response?.data ||
              "Something went wrong",
          };

          notify({ ...params });
        });
    } catch (e) {
      notify({ msg: "Username or Password is incorrect", type: "error" });
    }
  };

  const { values, touched, errors, handleSubmit, handleChange } = useFormik({
    initialValues: { password: undefined, passwordConfirmation: undefined },
    validationSchema: PASSWORD_RECOVERY?.validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <Container component="section" maxWidth="xs">
      <Paper elevation={4} className={classes.paper}>
        {/* Icon */}
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>

        {/* Title */}
        <Typography variant="h5">Set New Password</Typography>

        {/* Sub-title */}
        <Typography variant="subtitle1">
          Fill the form and submit to change your password
        </Typography>

        {/* Form start */}
        <form className={classes.form} onSubmit={handleSubmit}>
          {/* password field */}
          <TextField
            id="password"
            label="Enter new password"
            margin="normal"
            size="medium"
            value={values?.password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />

          {/* reset password field */}
          <TextField
            id="passwordConfirmation"
            label="Please re-enter password"
            margin="normal"
            size="medium"
            value={values?.passwordConfirmation}
            onChange={handleChange}
            error={
              touched.passwordConfirmation &&
              Boolean(errors.passwordConfirmation)
            }
            helperText={
              touched.passwordConfirmation && errors.passwordConfirmation
            }
          />

          {/* Submit password */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
