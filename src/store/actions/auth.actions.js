import { refreshAuthorization } from "shared/services";
import { instance as axios } from "shared/services/config.service";
import { tokenDecoder } from "shared/utilities/common.util";

import {
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_SUCCESS,
  START_SPINNER,
  STOP_SPINNER,
} from "./actionTypes";

export const startSpinner = () => ({ type: START_SPINNER });

export const stopSpinner = () => ({ type: STOP_SPINNER });

export const authSuccess = (data) => ({ type: AUTH_SUCCESS, ...data });

export const authFailure = () => ({ type: AUTH_FAILURE });

export const authLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expirationTime");
  localStorage.removeItem("user");
  localStorage.removeItem("user_name");
  localStorage.removeItem("project_status");
  localStorage.removeItem("user_id");
  localStorage.removeItem("project_id");
  localStorage.removeItem("project_title");
  localStorage.removeItem("project_description");
  localStorage.removeItem("initials");
  return { type: AUTH_LOGOUT };
};

export const authCheckState = (history) => (dispatch) => {
  const path = window?.location?.pathname;
  const { token, isExpired, refreshToken } = tokenDecoder();

  const currentTime = Math.floor(new Date().getTime() / 1000);
  const expirationTime = localStorage.getItem("expirationTime");

  if (token) {
    if (isExpired) {
      dispatch(authLogout());
      history.push("/signIn");
    } else {
      dispatch(authSuccess({ data: { token, refreshToken } }));
      dispatch(checkAuthTimeout(expirationTime - currentTime));
    }
    // history.push(path);
  }
};

export const checkAuthTimeout = (expirationTime) => (dispatch) => {
  setTimeout(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      axios(refreshAuthorization(refreshToken))
        .then((res) => {
          const {
            expires_in,
            access_token: token,
            refresh_token: refreshToken,
          } = res;
          const expirationTime = new Date(
            new Date().getTime() + (expires_in - 60) * 1000
          );
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("expirationTime", expirationTime);
          dispatch(authSuccess({ data: { token, refreshToken } }));
          dispatch(checkAuthTimeout((expires_in - 60) * 1000));
        })
        .catch((error) => {
          console.error(error);
          dispatch(authLogout());
        });
    }
  }, expirationTime);
};
