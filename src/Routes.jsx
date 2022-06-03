import { Redirect, Route, Switch } from "react-router-dom";
import loadable from "@loadable/component";

// SignIn
const SIGN_IN = loadable(() => import("./pages/SignIn"));
const UserInvitation = loadable(() => import("./pages/UserInvitation"));

// Dashboard
const Dashboard = loadable(() => import("./pages/Dashboard"));
const Home = loadable(() => import("./pages/Home"));
const STORAGE = loadable(() => import("./pages/Storage/Storage"));
// const Communication = loadable(() => import("./pages/Communication"));

// Route
// const ROUTE = {
//     ALL: loadable(() => import("./pages/Route/ViewAllRoute")),
//     VIEW: loadable(() => import("./pages/Route/ViewRoute")),
//     NEW: loadable(() => import("./pages/Route/CreateUpdateRoute")),
//     EDIT: loadable(() => import("./pages/Route/CreateUpdateRoute"))
// };

const CONTACT = {
  ALL: loadable(() => import("./pages/Contact/ViewAllContact")),
  VIEW: loadable(() => import("./pages/Contact/ViewContact")),
  NEW: loadable(() => import("./pages/Contact/CreateUpdateContact")),
  EDIT: loadable(() => import("./pages/Contact/CreateUpdateContact")),
};
// const STORAGE = {
//     ALL : loadable(() => import("./pages/Storage/Storage")),
//     VIEW : loadable(() => import("./pages/Storage/Storage")),
//     NEW : loadable(() => import("./pages/Storage/Storage")),
//     EDIT : loadable(() => import("./pages/Storage/Storage"))
// };

const PROJECT = {
  ALL: loadable(() => import("./pages/Project/ViewAllProject")),
  VIEW: loadable(() => import("./pages/Project/ViewProject")),
  NEW: loadable(() => import("./pages/Project/CreateUpdateProject")),
  EDIT: loadable(() => import("./pages/Project/CreateUpdateProject")),
};

const GROUP = {
  ALL: loadable(() => import("./pages/Group/ViewAllGroup")),
  VIEW: loadable(() => import("./pages/Group/ViewGroup")),
  NEW: loadable(() => import("./pages/Group/CreateUpdateGroup")),
  EDIT: loadable(() => import("./pages/Group/CreateUpdateGroup")),
};

const MEMO = {
  ALL: loadable(() => import("./pages/Communication/Memo/ViewAllMemo")),
  VIEW: loadable(() => import("./pages/Communication/Memo/ViewMemo")),
  NEW: loadable(() => import("./pages/Communication/Memo/CreateMemo")),
};

const MEMOTEMPLATE = {
  ALL: loadable(() =>
    import(
      "./pages/Communication/MemoTemplate/CreatorPages/ViewAllMemoTemplate"
    )
  ),
  VIEW: loadable(() =>
    import("./pages/Communication/MemoTemplate/CreatorPages/ViewMemoTemplate")
  ),
  NEW: loadable(() =>
    import(
      "./pages/Communication/MemoTemplate/CreatorPages/CreateUpdateMemoTemplate"
    )
  ),
  EDIT: loadable(() =>
    import(
      "./pages/Communication/MemoTemplate/CreatorPages/CreateUpdateMemoTemplate"
    )
  ),
};

const COMMUNICATION = {
  ALL: loadable(() => import("./pages/Communication/CommunicationIndex")),
};

// const ACCOUNT = loadable(() => import("./pages/Account"));

const pagesWithoutAuthentication = [
  { id: "signIn", path: "/signIn", component: SIGN_IN },
  {
    id: "user_invitation",
    path: "/user_invitation/accept",
    component: UserInvitation,
  },
];

const pagesWithAuthentication = [
  { id: "dashboard", path: "/dashboard", component: Dashboard },
  { id: "home", path: "/home", component: Home },
  {
    id: "communications",
    path: "/communications",
    component: COMMUNICATION.ALL,
  },

  { id: "library", path: "/library", component: STORAGE },

  { id: "contact", path: "/contacts", component: CONTACT.VIEW },
  { id: "contact_edit", path: "/contact/edit", component: CONTACT.EDIT },
  { id: "contact_new", path: "/contact/new", component: CONTACT.NEW },

  { id: "project", path: "/projects", component: PROJECT.ALL },
  { id: "project", path: "/project/view", component: PROJECT.VIEW },
  { id: "project_edit", path: "/project/edit", component: PROJECT.EDIT },
  { id: "project_new", path: "/project/new", component: PROJECT.NEW },

  { id: "group", path: "/groups", component: GROUP.ALL },
  { id: "group_view", path: "/group/view", component: GROUP.VIEW },
  { id: "group_edit", path: "/group/edit", component: GROUP.EDIT },
  { id: "group_new", path: "/group/new", component: GROUP.NEW },

  {
    id: "memo_template_new",
    path: "/memo_template/new",
    component: MEMOTEMPLATE.NEW,
  },
  {
    id: "memo_template_all",
    path: "/memo_template/all",
    component: MEMOTEMPLATE.ALL,
  },
  {
    id: "memo_template_edit",
    path: "/memo_template/edit",
    component: MEMOTEMPLATE.EDIT,
  },
  {
    id: "memo_template_view",
    path: "/memo_template/view",
    component: MEMOTEMPLATE.VIEW,
  },

  { id: "memo_new", path: "/memo/new", component: MEMO.NEW },
  { id: "memo_all", path: "/memo/all", component: MEMO.ALL },
  { id: "memo_view", path: "/memo/view", component: MEMO.VIEW },
];

const Routes = ({ isAuthenticated }) => {
  const pages = isAuthenticated
    ? pagesWithAuthentication
    : pagesWithoutAuthentication;
  const getRoutes = () =>
    pages.map((page) => (
      <Route
        key={page.id}
        id={page.id}
        exact
        path={page.path}
        component={page.component}
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
        to={!isAuthenticated ? "/user_invitation" : "/dashboard"}
      />
      <Redirect exact from="/" to={isAuthenticated ? "/home" : "/signIn"} />
    </Switch>
  );
};

export default Routes;
