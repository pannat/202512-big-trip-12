const eventTypes = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`]
};

const cities = [`Moscow`, `Saratov`, `Kazan`, `Zelenograd`, `Samara`, `Novosibirsk`, `Ufa`];

const groupToPretext = {
  transfer: `to`,
  activity: `in`
};

const calculateGroup = (type) => {
  let group = ``;
  for (const [key, value] of Object.entries(eventTypes)) {
    if (value.indexOf(type) !== -1) {
      group = key;
    }
  }
  return group;
};

export {eventTypes, cities, groupToPretext, calculateGroup};
