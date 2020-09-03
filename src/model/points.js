import Observer from "../utils/observer";
import moment from "moment";

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

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          dates: {
            startDate: moment(point[`date_from`]),
            endDate: moment(point[`date_to`]),
          },
          isFavorite: point[`is_favorite`],
          price: point[`base_price`]
        }
    );
    adaptedPoint.duration = adaptedPoint.dates.endDate.diff(adaptedPoint.dates.startDate);
    delete adaptedPoint[`date_from`];
    delete adaptedPoint[`date_to`];
    delete adaptedPoint[`is_favorite`];
    delete adaptedPoint[`base_price`];

    return adaptedPoint;
  }
}

export default Points;
