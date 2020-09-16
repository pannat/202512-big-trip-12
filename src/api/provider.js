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
  constructor(api, store) {
    this._api = api;
    this._store = store;
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
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }
    const localNewPointId = nanoid;
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.setItem(localNewPointId, PointsModel.adaptToServer(localNewPoint));
    this._isNeedSync = true;
    return Promise.resolve(localNewPoint);
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }
    this._store.removeItem(point.id);

    return Promise.resolve();
  }

  syncPoints() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.syncPoints(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  getDestinations() {

  }

  getOffers() {

  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
