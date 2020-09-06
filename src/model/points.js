import Observer from "../utils/observer";
import moment from "moment";

class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice(0);
    this._notify(updateType);
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

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          [`date_from`]: point.dates.startDate,
          [`date_to`]: point.dates.endDate,
          [`is_favorite`]: point.isFavorite,
          [`base_price`]: parseInt(point.price, 10)
        }
    );
    delete adaptedPoint.dates;
    delete adaptedPoint.duration;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;

    return adaptedPoint;
  }
}

export default Points;
