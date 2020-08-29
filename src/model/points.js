import Observer from "../utils/observer";

class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice(0);
  }

  getPoints() {
    return this._points;
  }

  addPoint(updateType, update) {
    this._points.push(update);

    this._notify(updateType, update);
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }
}

export default Points;
