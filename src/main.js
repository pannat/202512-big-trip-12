import NavView from "./view/nav";
import FiltersView from "./view/filters";
import {render, POINT_COUNT, RenderPosition} from "./utils";
import {generatePoint, filterList} from "./mock";
import TripInfoPresenter from "./presenter/trip-info";
import TripPresenter from "./presenter/trip";

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);

const points = new Array(POINT_COUNT).fill(``).map(generatePoint);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement);
tripInfoPresenter.init(points);

const tripPresenter = new TripPresenter(pointsContainerElement);
tripPresenter.init(points);
console.log(points)

const nav = new NavView();
const filters = new FiltersView(filterList);
render(controlsElement, nav.getElement(), RenderPosition.BEFORE_END);
render(controlsElement, filters.getElement(), RenderPosition.BEFORE_END);
