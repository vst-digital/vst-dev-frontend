import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

// SignIn
const SIGN_IN = loadable(() => import("./pages/SignIn"));
const UserInvitation = loadable(() => import("./pages/UserInvitation"));

// Dashboard
const Dashboard = loadable(() => import("./pages/Dashboard"));
const Home = loadable(() => import("./pages/Home"));
const Communication = loadable(() => import("./pages/Communication"));

// Route
// const ROUTE = {
//     ALL: loadable(() => import("./pages/Route/ViewAllRoute")),
//     VIEW: loadable(() => import("./pages/Route/ViewRoute")),
//     NEW: loadable(() => import("./pages/Route/CreateUpdateRoute")),
//     EDIT: loadable(() => import("./pages/Route/CreateUpdateRoute"))
// };

const CONTACT = {
    ALL : loadable(() => import("./pages/Contact/ViewAllContact")),
    VIEW : loadable(() => import("./pages/Contact/ViewContact")),
    NEW : loadable(() => import("./pages/Contact/CreateUpdateContact")),
    EDIT : loadable(() => import("./pages/Contact/CreateUpdateContact"))
}; 

const PROJECT = {
    ALL : loadable(() => import("./pages/Project/ViewAllProject")),
    VIEW : loadable(() => import("./pages/Project/ViewProject")),
    NEW : loadable(() => import("./pages/Project/CreateUpdateProject")),
    EDIT : loadable(() => import("./pages/Project/CreateUpdateProject"))
}; 

const GROUP = {
    ALL : loadable(() => import("./pages/Group/ViewAllGroup")),
    VIEW : loadable(() => import("./pages/Group/ViewGroup")),
    NEW : loadable(() => import("./pages/Group/CreateUpdateGroup")),
    EDIT : loadable(() => import("./pages/Group/CreateUpdateGroup"))
}; 

const ACCOUNT = loadable(() => import("./pages/Account"));

const pagesWithoutAuthentication = [
    {id: "signIn", path: "/signIn", component: SIGN_IN},
    {id: "user_invitation", path: "/user_invitation/accept", component: UserInvitation}
];

const pagesWithAuthentication = [
    {id: "dashboard", path: "/dashboard", component: Dashboard},
    {id: "home", path: "/home", component: Home},
    {id: "communications", path: "/communications", component: Communication},
    
    {id: "contact", path: "/contacts", component: CONTACT.VIEW},
    {id: "contact_edit", path: "/contact/edit", component: CONTACT.EDIT},
    {id: "contact_new", path: "/contact/new", component: CONTACT.NEW},
    
    {id: "project", path: "/projects", component: PROJECT.ALL},
    {id: "project", path: "/project/view", component: PROJECT.VIEW},
    {id: "project_edit", path: "/project/edit", component: PROJECT.EDIT},
    {id: "project_new", path: "/project/new", component: PROJECT.NEW},

    {id: "group", path: "/groups", component: GROUP.ALL},
    {id: "group_view", path: "/group/view", component: GROUP.VIEW},
    {id: "group_edit", path: "/group/edit", component: GROUP.EDIT},
    {id: "group_new", path: "/group/new", component: GROUP.NEW},

];

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
            {/* {console.log(getRoutes())} */}
            {/* <Redirect exact from="/user_invitation" to={!isAuthenticated ? "/user_invitation" : "/dashboard"}/> */}
            <Redirect exact from="/" to={isAuthenticated ? "/dashboard" : "/signIn"}/>
        </Switch>
    );
};

export default Routes;
