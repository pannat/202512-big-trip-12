import {getTripInfo} from "./view/trip-info";
import {getRoute} from "./view/route";
import {getTotalCost} from "./view/total-cost";
import {getNav} from "./view/nav";
import {getFilters} from "./view/filters";
import {getSorting} from "./view/sorting";
import {getDayList} from "./view/day-list";
import {getDay} from "./view/day";
import {getPointList} from "./view/point-list";
import {getPointEdit} from "./view/point-edit";
import {getPoint} from "./view/point";
import {render, POINT_COUNT, Position} from "./helpers";
import {generatePoint, filters, sortingTypes} from "./mock";

const points = new Array(POINT_COUNT).fill(``).map(generatePoint).sort((a, b) => a.dates.startDate - b.dates.startDate);

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

let days = [];

points.forEach(({dates}) => {
  const startDay = dates.startDate.toLocaleDateString(`en-US`);
  if (days.indexOf(startDay) === -1) {
    days.push(new Date(startDay));
  }
});

const totalPrice = () => points.reduce((acc, point) => {
  return acc + point.price;
}, 0);

const uniqueCities = () => {
  const cities = [];
  points.forEach((point) => {
    if (cities.indexOf(point.destination.name) === -1) {
      cities.push(point.destination.name);
    }
  });
  return cities;
};

const getDates = () => {
  const sortedPointsByEndDate = points.sort((a, b) => b.dates.endDate - a.dates.endDate);
  return [points[0].dates.startDate, sortedPointsByEndDate[0].dates.endDate];
};

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);

render(tripMainElement, getTripInfo(), Position.AFTER_BEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, getRoute(uniqueCities(), getDates()), Position.AFTER_BEGIN);
render(tripInfoElement, getTotalCost(totalPrice()), Position.BEFORE_END);

render(controlsElement, getNav(), Position.BEFORE_END);
render(controlsElement, getFilters(filters), Position.BEFORE_END);

render(pointsContainerElement, getSorting(sortingTypes), Position.BEFORE_END);
render(pointsContainerElement, getPointEdit(newPoint), Position.BEFORE_END);
render(pointsContainerElement, getDayList(), Position.BEFORE_END);

const TripDayListElement = document.querySelector(`.trip-days`);

days.forEach((day, i) => {
  render(TripDayListElement, getDay(day, i), Position.BEFORE_END);
});

const tripDayElements = document.querySelectorAll(`.trip-days__item`);

days.forEach((day, i) => {
  render(tripDayElements[i], getPointList(), Position.BEFORE_END);
  const pointListElement = tripDayElements[i].querySelector(`.trip-events__list`);
  const pointsForCurrentDay = points.filter(({dates}) => dates.startDate.toLocaleDateString(`en-US`) === day.toLocaleDateString(`en-US`));
  pointsForCurrentDay.forEach((point) => {
    render(pointListElement, getPoint(point), Position.BEFORE_END);
  });
});


