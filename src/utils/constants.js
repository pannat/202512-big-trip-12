const POINT_COUNT = 20;

const LOCALE = `en-US`;

const Format = {
  DATE_SHORT: {
    day: `numeric`,
    month: `short`
  }
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

export {POINT_COUNT, LOCALE, Format, SortType, sortTypes};
