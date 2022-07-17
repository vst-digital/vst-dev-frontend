import capitalize from "lodash/capitalize";
import JWT from "jwt-decode";
import find from "lodash/find";
import get from "lodash/get";
import includes from "lodash/includes";
import addHours from "date-fns/addHours";
import addMinutes from "date-fns/addMinutes";
import differenceInMinutes from "date-fns/differenceInMinutes";
import getHours from "date-fns/getHours";
import fnsFormat from "date-fns/format";
import fnsIsValid from "date-fns/isValid";
import {
  CURRENCY,
  DATE_FORMAT,
  DATE_TIME_FORMAT_24_HR,
  HOURS,
  KM,
} from "./constant";

export const computeHeight = (adjustment = 0) =>
  window.innerHeight - adjustment;

export const computeWidth = (adjustment = 0) => window.innerWidth - adjustment;

export const getInitials = (name = "") =>
  name
    .replace(/\s+/, " ")
    .split(" ")
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join("");

export const getFullName = (fName, lName) => {
  return `${!!fName ? fName : ""} ${!!lName ? lName : ""}`.trim();
};

export const renderBoolean = (value) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
};

export const getOptionLabel = (list, value) =>
  get(find(list, { value }), "label", "");

export const getAddressLabel = (address) =>
  address ? (address.name ? address.name : address.address1) : "";
export const getMemberLabel = (member) =>
  member ? (member.name ? member.name : member.email) : "";
export const getProjectLabel = (project) =>
  project ? (project.name ? project.name : project.project_description) : "";
export const getGroupLabel = (group) =>
  group ? (group.name ? group.name : group.description) : "";
export const getMemoTemplateLable = (memo_template) =>
  memo_template
    ? memo_template.name
      ? memo_template.name
      : memo_template.number.toString()
    : "";

export const getCurrencyLabel = (amount) =>
  amount ? `${CURRENCY} ${amount}` : `${CURRENCY} 0`;

export const getDistanceLabel = (distance) =>
  distance ? `${distance} ${KM}` : `0 ${KM}`;

export const getHoursLabel = (hours) => (hours ? `${hours} ${HOURS}` : `0 Hr`);

export const createArray = (length, value = null) =>
  Array.from({ length }).fill(value);

export const capitalizeStr = (str) => (str ? capitalize(str) : "");

export const getListFromObject = (obj) => {
  const list = [];
  for (const [value, label] of Object.entries(obj)) {
    list.push({ value, label });
  }
  return list;
};

export const formatTime = (timeStr) => {
  if (timeStr && includes(timeStr, ":")) {
    let arr = timeStr.split(":");
    arr = arr.map((item) => {
      if (item.length === 1) {
        item = item.padStart(2, "0");
      }
      return item;
    });
    return `${arr[0]}:${arr[1]}`;
  }
  return "";
};

export const formatDateTime = (dateTime, format = DATE_TIME_FORMAT_24_HR) => {
  if (dateTime && fnsIsValid(new Date(dateTime))) {
    return fnsFormat(new Date(dateTime), format);
  }
  return "";
};

export const formatDate = (date, format = DATE_FORMAT) => {
  if (date && fnsIsValid(new Date(date))) {
    return fnsFormat(new Date(date), format);
  }
  return "";
};

export const addHoursToDate = (date, hours = 0) => {
  return !date ? "" : addHours(new Date(date), hours);
};

export const addMinutesToDate = (date, mins = 0) => {
  return !date ? "" : addMinutes(new Date(date), mins);
};

export const getHoursFromDate = (date) => {
  return !date ? getHours(new Date()) : getHours(new Date(date));
};

export const diffInMinutes = (newDate, oldDate) => {
  return !newDate || !oldDate
    ? 0
    : differenceInMinutes(new Date(newDate), new Date(oldDate));
};

export const getYearList = (start = 1900, end) => {
  const yearList = [];
  let endYear = end ? end : new Date().getFullYear();
  while (endYear >= start) {
    yearList.push(endYear);
    endYear--;
  }
  return yearList;
};

export const calculateSum = (list) => list.reduce((acc, val) => acc + val, 0);

export const getFilters = (filterList) => {
  const filter = {};
  const FILTER_OPERATOR = {
    eq: "_eq",
    neq: "_not_eq",
    contains: "_cont",
    notContains: "_not_cont",
    empty: "_blank",
    notEmpty: "_present",
    startsWith: "_start",
    endsWith: "_end",
    gt: "_gt",
    gte: "_gteq",
    lt: "_lt",
    lte: "_lteq",
    after: "_gt",
    afterOrOn: "_gteq",
    before: "_lt",
    beforeOrOn: "_lteq",
    inlist: "_in",
    notinlist: "_not_in",
    inrange: "_gteq",
    notinrange: "_lteq",
  };
  filterList
    .filter((item) => !item.hasOwnProperty("active") || item.active)
    .filter((item) => item.value)
    .forEach((item) => {
      let filterKey = item.name + FILTER_OPERATOR[item.operator];
      filter[filterKey] = item.value;
    });
  return filter;
};

export const exportCSVFromDataGrid = (gridRef, fileName) => {
  const SEPARATOR = ",";
  const link = document.createElement("a");
  const columns = gridRef.current.visibleColumns;
  const header = columns.map((c) => c.name).join(SEPARATOR);
  const rows = gridRef.current.data.map((data) =>
    columns.map((c) => data[c.id]).join(SEPARATOR)
  );
  const contents = [header].concat(rows).join("\n");
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.position = "absolute";
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getSelectDataSource = async (
  requestHandler,
  requestConfig,
  options
) => {
  try {
    return await requestHandler(requestConfig, options);
  } catch (e) {
    throw e;
  }
};

export const hasError = (key, touched, errors) =>
  get(touched, key, false) && Boolean(get(errors, key));

export const errorMessage = (key, touched, errors) =>
  get(touched, key, false) && get(errors, key);

export const getNumberRoundToOneDecimal = (num = 0) =>
  Math.round((num + Number.EPSILON) * 10) / 10;

export const tokenDecoder = () => {
  let token;
  try {
    token = localStorage.getItem("token");
  } catch (error) {
    console.log("Token error: ", error);
  }

  if (!token) {
    return { isToken: false };
  }

  const decodedToken = JWT(token);
  const { email, exp, id, isMember, refreshToken = false } = decodedToken;

  const currentTime = Math.floor(new Date().getTime() / 1000);
  const isExpired = currentTime > exp ? true : false;
  const isToken = token ? true : false;

  return {
    token,
    id,
    email,
    isExpired,
    isMember,
    isToken,
    refreshToken,
  };
};
