const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

const getUpperFirst = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : ``;
};

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getTime = (date) => {
  return date.toLocaleTimeString(`en-US`, {hour: `numeric`, minute: `numeric`, hour12: false});
};

export {render, getUpperFirst, getRandomInt, getTime};