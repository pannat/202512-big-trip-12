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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export {getUpperFirst, getRandomInt, getFormattedDate, updateItem};
