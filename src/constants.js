const cities = [`Moscow`, `Saratov`, `Kazan`, `Zelenograd`, `Samara`, `Novosibirsk`, `Ufa`];

const eventTypes = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`]
};

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const sortTypes = [
  {
    name: SortType.EVENT,
    direction: false,
    isApply: true
  },
  {
    name: SortType.TIME,
    direction: `descend`,
    isApply: false
  },
  {
    name: SortType.PRICE,
    direction: `descend`,
    isApply: false
  }
];

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
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const POINT_COUNT = 1;

export {POINT_COUNT, LOCALE, UserAction, UpdateType, FilterType, groupToPretext, eventTypes, sortTypes, cities, SortType};
