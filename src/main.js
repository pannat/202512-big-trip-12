import TripInfoView from "./view/trip-info-view";
import RouteView from "./view/route-view";
import NavView from "./view/nav-view";
import FiltersView from "./view/filters-view";
import SortingView from "./view/sorting-view";
import DaysView from "./view/days-view";
import PointEditView from "./view/point-edit-view";
import PointView from "./view/point-view";
import {render, replace, POINT_COUNT, LOCALE, RenderPosition} from "./utils";
import {generatePoint, filterList, sortingTypes} from "./mock";
import MessageNoPointsView from "./view/message-no-points-view";

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);

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


const getRouteDates = () => {
  const sortedPointsByEndDate = points.sort((a, b) => b.dates.endDate - a.dates.endDate);
  return points.length ? [points[0].dates.startDate, sortedPointsByEndDate[0].dates.endDate] : ``;
};

const uniqueCities = () => {
  const cities = [];
  points.forEach((point) => {
    if (cities.indexOf(point.destination.name) === -1) {
      cities.push(point.destination.name);
    }
  });
  return cities;
};

const tripInfo = new TripInfoView(totalPrice());
render(tripMainElement, tripInfo.getElement(), RenderPosition.AFTER_BEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
const route = new RouteView(uniqueCities(), getRouteDates());
render(tripInfoElement, route.getElement(), RenderPosition.AFTER_BEGIN);

const nav = new NavView();
const filters = new FiltersView(filterList);
render(controlsElement, nav.getElement(), RenderPosition.BEFORE_END);
render(controlsElement, filters.getElement(), RenderPosition.BEFORE_END);

if (points.length) {
  const sorting = new SortingView(sortingTypes);
  render(pointsContainerElement, sorting.getElement(), RenderPosition.BEFORE_END);
} else {
  const message = new MessageNoPointsView();
  render(pointsContainerElement, message.getElement(), RenderPosition.BEFORE_END);
}

const days = new DaysView(uniqueDays);
render(pointsContainerElement, days.getElement(), RenderPosition.BEFORE_END);

const pointListElements = document.querySelectorAll(`.trip-events__list`);

pointListElements.forEach((element, i) => {
  const pointsForCurrentList = points.filter(({dates}) => dates.startDate.toLocaleDateString(LOCALE) === uniqueDays[i].toLocaleDateString(LOCALE));
  pointsForCurrentList.forEach((it) => {
    const point = new PointView(it);
    const pointEdit = new PointEditView(it);

    const replaceFormToCard = () => {
      replace(point.getElement(), pointEdit.getElement());
      point.setOnButtonClick(replaceCardToForm);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const replaceCardToForm = () => {
      replace(pointEdit.getElement(), point.getElement());
      pointEdit.setOnSubmitForm(replaceFormToCard);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    render(element, point.getElement(), RenderPosition.BEFORE_END);
    point.setOnButtonClick(replaceCardToForm);
  });
});

