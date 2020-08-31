import NavView from "./view/nav";

import TripInfoPresenter from "./presenter/trip-info";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import {POINT_COUNT} from "./constants";
import {render, RenderPosition} from "./utils/render";
import {generatePoint} from "./mock";

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = document.querySelector(`.trip-controls`);
const pointsContainerElement = document.querySelector(`.trip-events`);
const buttonNewPointElement = document.querySelector(`.trip-main__event-add-btn`);

const handlePointNewFormClose = () => {
  buttonNewPointElement.disabled = false;
};

const points = new Array(POINT_COUNT).fill(``).map(generatePoint);
const pointsModel = new PointsModel(points);
pointsModel.setPoints(points);
const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
tripInfoPresenter.init();

const tripPresenter = new TripPresenter(pointsContainerElement, pointsModel, filterModel, buttonNewPointElement);
tripPresenter.init();

const nav = new NavView();
render(controlsElement, nav.getElement(), RenderPosition.BEFORE_END);

const filterPresenter = new FilterPresenter(controlsElement, pointsModel, filterModel);
filterPresenter.init();

buttonNewPointElement.addEventListener(`click`, () => {
  tripPresenter.createPoint(handlePointNewFormClose);
  buttonNewPointElement.disabled = true;
});


