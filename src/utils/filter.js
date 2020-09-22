import {FilterType} from "../constants";

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dates.startDate > Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => point.dates.endDate < Date.now())
};

export {filter};
