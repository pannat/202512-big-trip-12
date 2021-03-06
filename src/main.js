import NavView from "./view/nav";
import StatsView from "./view/stats";

import TripInfoPresenter from "./presenter/trip-info";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import DictionariesModel from "./model/dictionaries";

import Api from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";

import {MenuItem, UpdateType} from "./constants";
import {render, RenderPosition, remove} from "./utils/render";

const AUTHORIZATION = `Basic er83gbgh5ghdw`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const StorePrefix = {
  POINTS: `points-localstorage`,
  DESTINATIONS: `destinations-localstorage`,
  OFFERS: `offers-localstorage`,
};
const STORE_VER = `v12`;

const tripMainElement = document.querySelector(`.trip-main`);
const controlsElement = tripMainElement.querySelector(`.trip-controls`);
const buttonNewPointElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const mainBodyElement = document.querySelector(`.page-main .page-body__container`);
const tripContainerElement = mainBodyElement.querySelector(`.trip-events`);

const StoreName = {
  POINTS: `${StorePrefix.POINTS}-${STORE_VER}`,
  DESTINATIONS: `${StorePrefix.DESTINATIONS}-${STORE_VER}`,
  OFFERS: `${StorePrefix.OFFERS}-${STORE_VER}`,
};

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
      tripPresenter.destroyCreateNewPoint();
      break;
    case MenuItem.TABLE:
      navView.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      remove(statsView);
      statsView = null;
      break;
  }
};

buttonNewPointElement.disabled = true;

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(window.localStorage, StoreName.POINTS);
const destinationStore = new Store(window.localStorage, StoreName.DESTINATIONS);
const offersStore = new Store(window.localStorage, StoreName.OFFERS);
const apiWithProvider = new Provider(api, pointsStore, destinationStore, offersStore);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const dictionariesModel = new DictionariesModel();
const navView = new NavView();
render(controlsElement, navView, RenderPosition.BEFORE_END);

let statsView = null;
const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel, dictionariesModel, apiWithProvider);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(controlsElement, pointsModel, filterModel);
tripPresenter.init();
filterPresenter.init();
tripInfoPresenter.init();

apiWithProvider.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch((error) => {
    pointsModel.setPoints(UpdateType.INIT, []);
    throw new Error(error);
  })
  .finally(() => {
    Promise.all([
      apiWithProvider.getDestinations(),
      apiWithProvider.getOffers()
    ]).then(([destinations, offersLists]) => {
      dictionariesModel.setDictionaries({
        destinations,
        offersLists
      });
      buttonNewPointElement.disabled = false;
    }).catch(() => {
      throw new Error(`Destinations or offers don't loaded. Button create new event not available`);
    }).finally(() => {
      navView.setOnMenuClick(handleMenuItemClick);
    });
  });

buttonNewPointElement.addEventListener(`click`, () => {
  tripPresenter.createPoint(handlePointNewFormClose);
  buttonNewPointElement.disabled = true;
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      document.title += ` [sw register]`;
    })
    .catch((error) => {
      throw new Error(error);
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.getIsNeedSync()) {
    apiWithProvider.syncPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.MINOR, points);
      })
      .catch((error) => {
        throw new Error(`Sync data failed. ${error}`);
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});


