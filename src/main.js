import NavView from "./view/nav";
import StatsView from "./view/stats";

import TripInfoPresenter from "./presenter/trip-info";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import {POINT_COUNT, MenuItem} from "./constants";
import {render, RenderPosition, remove} from "./utils/render";
import {generatePoint} from "./mock";

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = tripMainElement.querySelector(`.trip-controls`);
const buttonNewPointElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const mainBodyElement = document.querySelector(`.page-main .page-body__container`);
const tripContainerElement = mainBodyElement.querySelector(`.trip-events`);

const handlePointNewFormClose = () => {
  buttonNewPointElement.disabled = false;
};

const points = new Array(POINT_COUNT).fill(``).map(generatePoint);
const pointsModel = new PointsModel(points);
pointsModel.setPoints(points);
const filterModel = new FilterModel();

const navView = new NavView();
const statsView = new StatsView();
const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel, buttonNewPointElement);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(controlsElement, pointsModel, filterModel);

const handleMenuItemClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      navView.setMenuItem(MenuItem.STATS);
      render(mainBodyElement, statsView, RenderPosition.BEFORE_END);
      statsView.getElement().classList.remove(`visually-hidden`);
      tripPresenter.destroy();
      break;
    case MenuItem.TABLE:
      navView.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      remove(statsView);
      break;
  }
};

navView.setOnMenuClick(handleMenuItemClick);
render(controlsElement, navView, RenderPosition.BEFORE_END);

tripInfoPresenter.init();
tripPresenter.init();
filterPresenter.init();

buttonNewPointElement.addEventListener(`click`, () => {
  tripPresenter.createPoint(handlePointNewFormClose);
  buttonNewPointElement.disabled = true;
});

