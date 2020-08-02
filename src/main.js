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

const TripMainElement = document.querySelector(`.trip-main`);
const ControlsElement = document.querySelector(`.trip-controls`);
const PointsContainerElement = document.querySelector(`.trip-events`);

render(TripMainElement, getTripInfo(), Position.AFTER_BEGIN);

const TripInfoElement = document.querySelector(`.trip-info`);
render(TripInfoElement, getRoute(), Position.AFTER_BEGIN);
render(TripInfoElement, getTotalCost(), Position.BEFORE_END);

render(ControlsElement, getNav(), Position.BEFORE_END);
render(ControlsElement, getFilters(), Position.BEFORE_END);

render(PointsContainerElement, getSorting(), Position.BEFORE_END);
render(PointsContainerElement, getPointEdit(), Position.BEFORE_END);
render(PointsContainerElement, getDayList(), Position.BEFORE_END);

const TripDayListElement = document.querySelector(`.trip-days`);
render(TripDayListElement, getDay(), Position.BEFORE_END);

const TripDayElement = document.querySelector(`.trip-days__item`);
render(TripDayElement, getPointList(), Position.BEFORE_END);

const PointListElement = document.querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(PointListElement, getPoint(), Position.BEFORE_END);
}

