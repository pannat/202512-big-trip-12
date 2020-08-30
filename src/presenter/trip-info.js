import {render, remove, RenderPosition} from "../utils/render";
import Route from "../view/route";
import TripInfoView from "../view/trip-info";

class TripInfo {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._routeView = null;
    this._tripInfoView = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const totalPrice = this._getTotalPrice();
    const cities = this._getUniqueCities();
    const routeDates = this._getRouteDates();
    this._tripInfoView = new TripInfoView(totalPrice);
    render(this._container, this._tripInfoView, RenderPosition.AFTER_BEGIN);
    this._routeView = new Route(cities, routeDates);
    render(this._tripInfoView, this._routeView, RenderPosition.AFTER_BEGIN);
  }

  _getPoints() {
    return this._pointsModel.getPoints().sort((a, b) => a.dates.startDate - b.dates.startDate);
  }

  _getUniqueCities() {
    const cities = [];
    this._getPoints().forEach((point) => {
      if (cities.indexOf(point.destination.name) === -1) {
        cities.push(point.destination.name);
      }
    });
    return cities;
  }

  _getTotalPrice() {
    return this._getPoints().reduce((acc, point) => {
      return acc + parseInt(point.price, 10);
    }, 0);
  }

  _getRouteDates() {
    const sortedPointsByEndDate = this._getPoints().slice(0).sort((a, b) => b.dates.endDate - a.dates.endDate);
    return this._getPoints().length ? [this._getPoints()[0].dates.startDate, sortedPointsByEndDate[0].dates.endDate] : ``;
  }

  _handleModelEvent() {
    remove(this._tripInfoView);
    remove(this._routeView);
    this._tripInfoView = null;
    this._routeView = null;

    this.init();
  }
}

export default TripInfo;
