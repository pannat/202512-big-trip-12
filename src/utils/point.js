import {eventTypes} from "../constants";

const calculateGroup = (type) => {
  let group = ``;
  for (const [key, value] of Object.entries(eventTypes)) {
    if (value.indexOf(type) !== -1) {
      group = key;
    }
  }
  return group;
};

export {calculateGroup};
