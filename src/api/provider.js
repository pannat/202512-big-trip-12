import PointsModel from "../model/points";
import {nanoid} from "nanoid";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current
    });
  }, {});
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success).map(({payload}) => payload.points);
};

class Provider {
  constructor(api, pointsStore, destinationsStore, offersStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
    this._isNeedSync = false;
  }

  getIsNeedSync() {
    return this._isNeedSync;
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._pointsStore.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._pointsStore.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationsStore.setItems(destinations);
          return destinations;
        });
    }

    const storeDestinations = this._destinationsStore.getItems();

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._offersStore.setItems(offers);
          return offers;
        });
    }

    const storeDestinations = this._offersStore.getItems();

    return Promise.resolve(storeDestinations);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }
    const localNewPointId = nanoid;
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});
    this._pointsStore.setItem(localNewPointId, PointsModel.adaptToServer(localNewPoint));
    this._isNeedSync = true;
    return Promise.resolve(localNewPoint);
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._pointsStore.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));
    this._isNeedSync = true;

    return Promise.resolve(point);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._pointsStore.removeItem(point.id));
    }

    this._pointsStore.removeItem(point.id);
    this._isNeedSync = true;

    return Promise.resolve();
  }

  syncPoints() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._pointsStore.getItems());

      return this._api.syncPoints(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
