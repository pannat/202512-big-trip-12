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
import {generatePoint} from "./mock/point";

const points = new Array(POINT_COUNT).fill(``).map(generatePoint);

let days = [];

points.forEach(({dates}) => {
  const startDay = dates.startDate.toLocaleDateString(`en-US`);
  if (!days.find((day) => day === startDay)) {
    days.push(startDay);
  }
});

days = days.map((day) => new Date(day)).sort((a, b) => a - b);

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);

render(tripMainElement, getTripInfo(), Position.AFTER_BEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, getRoute(), Position.AFTER_BEGIN);
render(tripInfoElement, getTotalCost(), Position.BEFORE_END);

render(controlsElement, getNav(), Position.BEFORE_END);
render(controlsElement, getFilters(), Position.BEFORE_END);

render(pointsContainerElement, getSorting(), Position.BEFORE_END);
render(pointsContainerElement, getPointEdit(points[0]), Position.BEFORE_END);
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
