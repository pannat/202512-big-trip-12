const eventTypes = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`]
};

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  PATCH: `PATCH`,
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

const groupToPretext = {
  transfer: `to`,
  activity: `in`
};

export {UserAction, UpdateType, FilterType, eventTypes, SortType, MenuItem, groupToPretext};
