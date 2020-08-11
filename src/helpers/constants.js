const POINT_COUNT = 20;

const Position = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
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

export {Position, EventTypes, POINT_COUNT, groupToPretext, cities};
