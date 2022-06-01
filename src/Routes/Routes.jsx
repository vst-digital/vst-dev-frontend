import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";
import {memberPages, siteOwnerPages, projectAdminPages} from "./pagesWithAuthentication"
// SignIn
const SIGN_IN = loadable(() => import("../pages/SignIn"));
const UserInvitation = loadable(() => import("../pages/UserInvitation"));

const pagesWithoutAuthentication = [
    {id: "signIn", path: "/signIn", component: SIGN_IN},
    {id: "user_invitation", path: "/user_invitation/accept", component: UserInvitation}
];
var pagesWithAuthentication = memberPages

const user = localStorage.getItem("user");
    if ( user === "site_owner" ){ pagesWithAuthentication = siteOwnerPages }
    else if ( user === "project_admin" ){ pagesWithAuthentication = projectAdminPages }
      
const Routes = ({isAuthenticated}) => {
    const pages = isAuthenticated ? pagesWithAuthentication : pagesWithoutAuthentication;
    
    const getRoutes = () => pages.map((page) => <Route
        key={page.id}
        id={page.id}
        exact path={page.path}
        component={page.component}
    />);

    return (
        <Switch>
            {getRoutes()}
            <Redirect from="/user_invitation/accept" to={!isAuthenticated ? "/dashboard" : "/user_invitation/accept"}/>
            {console.log(isAuthenticated)}
            <Redirect exact from="/user_invitation" to={!isAuthenticated ? "/user_invitation" : "/dashboard"}/>
            <Redirect exact from="/" to={isAuthenticated ? "/dashboard" : "/signIn"}/>
        </Switch>
    );
};

export default Routes;
