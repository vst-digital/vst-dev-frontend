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

import { useStyles } from "./Style";

const ForgotPassword = () => {
  const classes = useStyles();
  const { notify } = useHttp();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const { email } = values;

    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios
        .post(process.env.REACT_APP_API_BASE_URL + "users/password", {
          user: {
            email: email,
          },
        })
        .then(function () {
          const params = {
            show: true,
            originVertical: "top",
            originHorizontal: "center",
            type: "success",
            message: "Reset link has been sent to your email",
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
            message: error?.response?.data || "Something went wrong",
          };

          notify({ ...params });
        });
    } catch (e) {
      notify({ msg: "Username or Password is incorrect", type: "error" });
    }
  };

  const { values, touched, errors, handleSubmit, handleChange } = useFormik({
    initialValues: { email: undefined },
    validationSchema: PASSWORD_RECOVERY?.SEND_LINK,
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
        <Typography variant="h5">Forgot Password?</Typography>

        {/* sub-title */}
        <Typography variant="subtitle1">
          Enter your email to send a password reset link
        </Typography>

        {/* Form start */}
        <form className={classes.form} onSubmit={handleSubmit}>
          {/* Email */}
          <TextField
            id="email"
            label="Email"
            margin="normal"
            size="medium"
            value={values?.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            Send Link
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
