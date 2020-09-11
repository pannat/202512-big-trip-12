import NavView from "./view/nav";
import StatsView from "./view/stats";

import TripInfoPresenter from "./presenter/trip-info";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import DictionariesModel from "./model/dictionaries";

import Api from "./api";

import {MenuItem, UpdateType} from "./constants";
import {render, RenderPosition, remove} from "./utils/render";

const AUTHORIZATION = `Basic er835jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = tripMainElement.querySelector(`.trip-controls`);
const buttonNewPointElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const mainBodyElement = document.querySelector(`.page-main .page-body__container`);
const tripContainerElement = mainBodyElement.querySelector(`.trip-events`);

buttonNewPointElement.disabled = true;

const handlePointNewFormClose = () => {
  buttonNewPointElement.disabled = false;
};

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

const api = new Api(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const dictionariesModel = new DictionariesModel();
const navView = new NavView();
navView.setOnMenuClick(handleMenuItemClick);
render(controlsElement, navView, RenderPosition.BEFORE_END);

let statsView = null;
const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel, dictionariesModel, api);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(controlsElement, pointsModel, filterModel);
tripPresenter.init();
tripInfoPresenter.init();
filterPresenter.init();

Promise.all([
  api.getDestinations(),
  api.getOffers()
])
  .then(([destination, offersLists]) => {
    dictionariesModel.setDestination(destination);
    dictionariesModel.setOffersLists(offersLists);

    api.getPoint()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
        buttonNewPointElement.disabled = false;
      })
      .catch((error) => {
        pointsModel.setPoints(UpdateType.INIT, []);
        throw new Error(error);
      });
  })
  .catch((error) => {
    throw new Error(error);
  });

buttonNewPointElement.addEventListener(`click`, () => {
  tripPresenter.createPoint(handlePointNewFormClose);
  buttonNewPointElement.disabled = true;
});
