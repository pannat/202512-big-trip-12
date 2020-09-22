import {eventTypes} from "../constants";
import moment from "moment";

const calculateGroup = (type) => {
  let group = ``;
  for (const [key, value] of Object.entries(eventTypes)) {
    if (value.indexOf(type) !== -1) {
      group = key;
    }
  }
  return group;
};

const humanizeDuration = (diff) => {
  if (diff <= -1) {
    throw new Error(`Humanize duration failed. Duration cannot be less than 0`);
  }
  const setFormatUnitTime = (unit) => unit > 9 ? unit : `0${unit}`;

  const days = setFormatUnitTime(moment.duration(diff).days());
  const hours = setFormatUnitTime(moment.duration(diff).hours());
  const minutes = setFormatUnitTime(moment.duration(diff).minutes());
  let duration = ``;

  if (parseInt(days, 10)) {
    duration += `${days}D ${hours}H`;
  } else if (parseInt(hours, 10)) {
    duration += `${hours}H`;
  }
  duration += ` ${minutes}M`;

  return duration;
};

export {calculateGroup, humanizeDuration};
