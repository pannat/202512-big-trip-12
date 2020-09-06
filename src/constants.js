const eventTypes = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`]
};

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const groupToPretext = {
  transfer: `to`,
  activity: `in`
};

const LOCALE = `en-US`;

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

const POINT_COUNT = 2;

export {POINT_COUNT, LOCALE, UserAction, UpdateType, FilterType, groupToPretext, eventTypes, SortType, MenuItem};
