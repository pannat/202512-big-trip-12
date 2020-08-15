const POINT_COUNT = 20;

const LOCALE = `en-US`;

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
};

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

const EventTypes = {
  TRANSFER: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  ACTIVITY: [`check-in`, `sightseeing`, `restaurant`]
};

const cities = [`Moscow`, `Saratov`, `Kazan`, `Zelenograd`, `Samara`, `Novosibirsk`, `Ufa`];

const groupToPretext = {
  transfer: `to`,
  activity: `in`
};

const newPoint = {
  id: null,
  type: ``,
  price: null,
  dates: {
    startDate: new Date(),
    endDate: new Date()
  },
  destination: {
    name: ``,
    description: ``,
    photos: []
  },
  offers: []
};


export {POINT_COUNT, LOCALE, RenderPosition, Format, EventTypes, groupToPretext, cities, newPoint};
