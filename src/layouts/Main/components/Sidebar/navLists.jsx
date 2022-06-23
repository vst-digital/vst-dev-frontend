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
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MapIcon from "@mui/icons-material/Map";

export const memberList = [
  { id: "home", path: "/home", label: "Home", icon: Dashboard },
  {
    id: "documentManager",
    path: "/storages",
    label: "File Manager",
    icon: Storage,
  },
  {
    id: "communications",
    path: "/communications",
    label: "Communication",
    icon: ChatBubble,
  },
  {
    id: "inspection",
    path: "/inspection",
    label: "Inspection Sheets",
    icon: AssignmentTurnedInIcon,
  },
  {
    id: "calendar",
    path: "/calendar",
    label: "Calendar",
    icon: CalendarTodayIcon,
  },
  {
    id: "maps",
    path: "/maps",
    label: "Maps",
    icon: MapIcon,
  },
  { id: "library", path: "/library", label: "Library", icon: MenuBookIcon },
];
export const adminList = [
  {
    id: "projectInformation",
    path: "/projectInformation",
    label: "Project Information",
    icon: AccountTree,
  },
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
  { id: "contacts_id", path: "/contacts", label: "Members", icon: ContactMail },
  { id: "report", path: "/report", label: "Reports", icon: LibraryBooksIcon },
];
export const siteOwnerList = [
  {
    id: "projectInformation",
    path: "/projectInformation",
    label: "Project Information",
    icon: AccountTree,
  },
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
  { id: "contacts_id", path: "/contacts", label: "Members", icon: ContactMail },
  { id: "report", path: "/report", label: "Reports", icon: LibraryBooksIcon },
];
