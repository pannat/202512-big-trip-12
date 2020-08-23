const POINT_COUNT = 20;

const LOCALE = `en-US`;

const Format = {
  DATE_LONG: {
    year: `numeric`,
    month: `numeric`,
    day: `numeric`
  },
  DATE_SHORT: {
    day: `numeric`,
    month: `short`
  },
  TIME: {
    hour: `numeric`,
    minute: `numeric`,
    hour12: false
  }
};

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const eventTypes = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`]
};

const cities = [`Moscow`, `Saratov`, `Kazan`, `Zelenograd`, `Samara`, `Novosibirsk`, `Ufa`];

const groupToPretext = {
  transfer: `to`,
  activity: `in`
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

export {POINT_COUNT, LOCALE, Format, SortType, eventTypes, groupToPretext, cities, sortTypes};
