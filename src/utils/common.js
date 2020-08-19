import {LOCALE} from "./constants";

const getUpperFirst = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : ``;
};

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getFormattedDate = (date, format, isDate = true) => {
  return isDate ? date.toLocaleDateString(LOCALE, format) : date.toLocaleTimeString(LOCALE, format);
};

export {getUpperFirst, getRandomInt, getFormattedDate};
