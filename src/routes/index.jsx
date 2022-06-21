import loadable from "@loadable/component";
import { Redirect, Route, Switch } from "react-router-dom";
import { memberPages, projectAdminPages, siteOwnerPages } from "./Routes";
// SignIn
const SIGN_IN = loadable(() => import("../pages/SignIn"));
const UserInvitation = loadable(() => import("../pages/UserInvitation"));

const pagesWithoutAuthentication = [
  { id: "signIn", path: "/signIn", component: SIGN_IN },
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
}
if (role === "subscription_owner") {
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
      <Redirect
        from="/user_invitation/accept"
        to={!isAuthenticated ? "/home" : "/user_invitation/accept"}
      />
      <Redirect
        exact
        from="/user_invitation"
        to={!isAuthenticated ? "/user_invitation" : "/home"}
      />
      <Redirect exact from="/" to={isAuthenticated ? "/home" : "/signIn"} />
    </Switch>
  );
};

export default Routes;
