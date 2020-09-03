import NavView from "./view/nav";
import StatsView from "./view/stats";

import TripInfoPresenter from "./presenter/trip-info";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import DictionariesModel from "./model/dictionaries";

import Api from "./api";

import {MenuItem} from "./constants";
import {render, RenderPosition, remove} from "./utils/render";

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = tripMainElement.querySelector(`.trip-controls`);
const buttonNewPointElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const mainBodyElement = document.querySelector(`.page-main .page-body__container`);
const tripContainerElement = mainBodyElement.querySelector(`.trip-events`);

const handlePointNewFormClose = () => {
  buttonNewPointElement.disabled = false;
};

const api = new Api(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const dictionariesModel = new DictionariesModel();
const navView = new NavView();

let statsView = null;
let tripPresenter = null;
let tripInfoPresenter = null;
let filterPresenter = null;

const handleMenuItemClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      navView.setMenuItem(MenuItem.STATS);
      statsView = new StatsView(pointsModel.getPoints());
      render(mainBodyElement, statsView, RenderPosition.BEFORE_END);
      tripPresenter.destroy();
      break;
    case MenuItem.TABLE:
      navView.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      remove(statsView);
      statsView = null;
      break;
  }
};

navView.setOnMenuClick(handleMenuItemClick);
render(controlsElement, navView, RenderPosition.BEFORE_END);

buttonNewPointElement.addEventListener(`click`, () => {
  tripPresenter.createPoint(handlePointNewFormClose);
  buttonNewPointElement.disabled = true;
});

Promise.all([
  api.getPoint(),
  api.getDestinations(),
  api.getOffers()
])
  .then(([points, destination, offers]) => {
    dictionariesModel.setDestination(destination);
    dictionariesModel.setOffers(offers);
    pointsModel.setPoints(points);

    tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel, dictionariesModel);
    tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
    filterPresenter = new FilterPresenter(controlsElement, pointsModel, filterModel);
  })
  .then(() => {
    tripInfoPresenter.init();
    tripPresenter.init();
    filterPresenter.init();
  });


