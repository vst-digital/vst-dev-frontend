import {
  ArrowDropDown,
  ArrowDropUp,
  ContactMail,
  Dashboard,
  SettingsApplications,
  Category,
  AccountTree,
  ChatBubble,
  Storage,
} from "@material-ui/icons";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MenuBookIcon from "@material-ui/icons/MenuBook";

export const memberList = [
  { id: "home", path: "/home", label: "Home", icon: Dashboard },
  {
    id: "communications",
    path: "/communications",
    label: "Communication",
    icon: ChatBubble,
  },
  {
    id: "calendar",
    path: "/calendar",
    label: "Calendar",
    icon: CalendarTodayIcon,
  },
  {
    id: "documentManager",
    path: "/storages",
    label: "File Manager",
    icon: Storage,
  },
  { id: "library", path: "/library", label: "Library", icon: MenuBookIcon },
];
export const adminList = [
  {
    id: "project_setting",
    label: "Project Setting",
    icon: SettingsApplications,
    subMenu: [
      { id: "groups", path: "/groups", label: "Groups" },
      { id: "roles", path: "/roles", label: "Role" },
      { id: "permissions", path: "/permissions", label: "Permission" },
    ],
  },
  {
    id: "projectInformation",
    path: "/projectInformation",
    label: "Project Information",
    icon: AccountTree,
  },
  { id: "contacts_id", path: "/contacts", label: "Members", icon: ContactMail },
  { id: "report", path: "/report", label: "Report", icon: LibraryBooksIcon },
];
export const siteOwnerList = [
  {
    id: "project_setting",
    label: "Project Setting",
    icon: SettingsApplications,
    subMenu: [
      { id: "groups", path: "/groups", label: "Groups" },
      { id: "roles", path: "/roles", label: "Role" },
      { id: "permissions", path: "/permissions", label: "Permission" },
    ],
  },
  {
    id: "projectInformation",
    path: "/projectInformation",
    label: "Project Information",
    icon: AccountTree,
  },
  { id: "contacts_id", path: "/contacts", label: "Members", icon: ContactMail },
  { id: "report", path: "/report", label: "Report", icon: LibraryBooksIcon },
];
