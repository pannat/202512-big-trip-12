import TripInfo from "./view/trip-info";
import Route from "./view/route";
import Nav from "./view/nav";
import Filters from "./view/filters";
import Sorting from "./view/sorting";
import Days from "./view/days";
import PointEdit from "./view/point-edit";
import Point from "./view/point";
import {render, POINT_COUNT, LOCALE, RenderPosition} from "./helpers";
import {generatePoint, filterList, sortingTypes} from "./mock";

const points = new Array(POINT_COUNT).fill(``).map(generatePoint).sort((a, b) => a.dates.startDate - b.dates.startDate);

let uniqueDays = [];

points.forEach(({dates}) => {
  const startDay = dates.startDate.toLocaleDateString(`en-US`);
  if (uniqueDays.indexOf(startDay) === -1) {
    uniqueDays.push(new Date(startDay));
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

const getRouteDates = () => {
  const sortedPointsByEndDate = points.sort((a, b) => b.dates.endDate - a.dates.endDate);
  return [points[0].dates.startDate, sortedPointsByEndDate[0].dates.endDate];
};

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);


const tripInfo = new TripInfo(totalPrice());
render(tripMainElement, tripInfo.getElement(), RenderPosition.AFTER_BEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
const route = new Route(uniqueCities(), getRouteDates());
render(tripInfoElement, route.getElement(), RenderPosition.AFTER_BEGIN);

const nav = new Nav();
const filters = new Filters(filterList);
render(controlsElement, nav.getElement(), RenderPosition.BEFORE_END);
render(controlsElement, filters.getElement(), RenderPosition.BEFORE_END);

const sorting = new Sorting(sortingTypes);
render(pointsContainerElement, sorting.getElement(), RenderPosition.BEFORE_END);

const days = new Days(uniqueDays);
render(pointsContainerElement, days.getElement(), RenderPosition.BEFORE_END);

const pointListElements = document.querySelectorAll(`.trip-events__list`);

pointListElements.forEach((element, i) => {
  const pointsForCurrentList = points.filter(({dates}) => dates.startDate.toLocaleDateString(LOCALE) === uniqueDays[i].toLocaleDateString(LOCALE));
  pointsForCurrentList.forEach((it) => {
    const point = new Point(it);
    const pointEdit = new PointEdit(it);
    const renderPoint = () => {
      element.replaceChild(point.getElement(), pointEdit.getElement());
      point.setHandlers();
    };

    point.setOnRollupButton(() => {
      element.replaceChild(pointEdit.getElement(), point.getElement());
      pointEdit.setHandlers();
    });

    pointEdit.setOnCloseButton(() => {
      renderPoint();
    });

    pointEdit.setOnSubmitForm(() => {
      renderPoint();
    });

    render(element, point.getElement(), RenderPosition.BEFORE_END);
    point.setHandlers();
  });
});

