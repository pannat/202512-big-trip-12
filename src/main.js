import NavView from "./view/nav-view";
import FiltersView from "./view/filters-view";
import {render, POINT_COUNT, RenderPosition} from "./utils";
import {generatePoint, filterList} from "./mock";
import TripInfo from "./presenter/trip-info";
import Trip from "./presenter/trip";

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);

const points = new Array(POINT_COUNT).fill(``).map(generatePoint);

const tripInfoPresenter = new TripInfo(tripMainElement);
tripInfoPresenter.init(points);

const tripPresenter = new Trip(pointsContainerElement);
tripPresenter.init(points);

const nav = new NavView();
const filters = new FiltersView(filterList);
render(controlsElement, nav.getElement(), RenderPosition.BEFORE_END);
render(controlsElement, filters.getElement(), RenderPosition.BEFORE_END);
