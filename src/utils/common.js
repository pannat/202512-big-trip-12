const getUpperFirst = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : ``;
};

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const debounce = function (callback, wait, immediate) {
  let timeout;
  return function (...params) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) {
        callback.call(null, ...params);
      }
    }, wait);

    if (immediate && !timeout) {
      callback.call(null, ...params);
    }
  };
};

export {getUpperFirst, getRandomInt, debounce};
