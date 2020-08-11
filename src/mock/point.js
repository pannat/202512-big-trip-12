import {getRandomInt} from "../helpers";

const destinations = [`Moscow`, `Saratov`, `Kazan`, `Zelenograd`, `Samara`, `Novosibirsk`, `Ufa`];

const additionalOptions = {
  transfer: [`add luggage`, `switch to comfort class`],
  activity: [`add meal`, `choose seats`, `travel by train`]
};

const sentences = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
  .split(`. `);

const getRandomArray = (source, count) => {
  const sourceCopy = source.slice();
  return new Array(getRandomInt(0, count)).fill(``).map(() => sourceCopy.splice(getRandomInt(0, sourceCopy.length - 1), 1)[0]);
};

const types = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`]
};

const generateGroupType = () => {
  const groups = Object.keys(types);
  return groups[getRandomInt()];
};

const generateType = (group) => {
  return types[group][getRandomInt(0, types[group].length - 1)];
};

const generatePhotos = () => {
  return new Array(getRandomInt(1, 5)).fill(``).map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInt(-maxDaysGap, maxDaysGap);

  const startDate = new Date();
  startDate.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59), getRandomInt(0, 999));
  startDate.setDate(startDate.getDate() + daysGap);

  const diff = getRandomInt(1, 5);
  const endDate = new Date();
  endDate.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59), getRandomInt(0, 999));
  startDate.setDate(startDate.getDate() + diff);

  return {
    startDate,
    endDate
  };
};

const generateOffers = (offers) => {
  return offers.map((offer) => ({
    title: offer,
    price: getRandomInt(10, 220),
    isApply: !!getRandomInt()
  }));
};

let i = -1;

const generatePartPoint = () => ({
  id: ++i,
  destination: {
    name: destinations[getRandomInt(0, destinations.length - 1)],
    description: getRandomArray(sentences, sentences.length).join(`. `),
    photos: generatePhotos()
  },
  price: getRandomInt(20, 400),
  dates: generateDate()
});

const generatePoint = () => {
  const point = generatePartPoint();
  point.group = generateGroupType();
  point.type = generateType(point.group);

  let currentGroupType;
  for (let group of Object.keys(types)) {
    if (types[group].find((it) => it === point.type)) {
      currentGroupType = group;
      break;
    }
  }
  point.offers = generateOffers(getRandomArray(additionalOptions[currentGroupType], additionalOptions[currentGroupType].length));
  return point;
};

export {generatePoint};
