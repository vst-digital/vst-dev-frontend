import loadable from "@loadable/component";
import { Redirect, Route, Switch } from "react-router-dom";
import { memberPages, projectAdminPages, siteOwnerPages } from "./Routes";

// SignIn
const SIGN_IN = loadable(() => import("../pages/SignIn"));
const FORGOT_PASSWORD = loadable(() => import("../pages/ForgotPassword"));
const RESET_PASSWORD = loadable(() => import("../pages/ResetPassword"));
const UserInvitation = loadable(() => import("../pages/UserInvitation"));

const pagesWithoutAuthentication = [
  { id: "signIn", path: "/signIn", component: SIGN_IN },
  {
    id: "forgotPassword",
    path: "/forgot_password",
    component: FORGOT_PASSWORD,
  },
  { id: "resetPassword", path: "/reset_password", component: RESET_PASSWORD },
  {
    id: "user_invitation",
    path: "/user_invitation/accept",
    component: UserInvitation,
  },
];

const role = localStorage.getItem("role");
var pagesWithAuthentication = [...memberPages];
if (role === "site_owner") {
  pagesWithAuthentication = [...memberPages, ...siteOwnerPages];
} else if (role === "project_admin") {
  pagesWithAuthentication = [...memberPages, ...projectAdminPages];
}

const Routes = ({ isAuthenticated }) => {
  const pages = isAuthenticated
    ? pagesWithAuthentication
    : pagesWithoutAuthentication;

  const getRoutes = () =>
    pages.map((page) => (
      <Route
        key={page?.id}
        id={page?.id}
        exact
        path={page?.path}
        component={page?.component}
      />
    ));

  return (
    <Switch>
      {getRoutes()}
      {/* <Redirect
        from="/user_invitation/accept"
        to={!isAuthenticated ? "/home" : "/user_invitation/accept"}
      />
      <Redirect
        exact
        from="/user_invitation"
        to={!isAuthenticated ? "/user_invitation" : "/home"}
      /> */}
      {/* <Redirect exact from="/" to={isAuthenticated ? "/home" : "/signIn"} /> */}
      <Route path="*">
        <Redirect to="/signIn" />
      </Route>
    </Switch>
  );
};

export default Routes;
