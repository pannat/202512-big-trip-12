import TripInfoView from "../view/trip-info-view";
import {render, RenderPosition} from "../utils";
import RouteView from "../view/route-view";

class TripInfo {
  constructor(container) {
    this._container = container;
  }

  init(points) {
    this._points = points.slice(0).sort((a, b) => a.dates.startDate - b.dates.startDate);
    this.renderTripInfo();
  }

  renderTripInfo() {
    const totalPrice = this._getTotalPrice();
    const cities = this._getUniqueCities();
    const routeDates = this._getRouteDates();
    const tripInfoView = new TripInfoView(totalPrice);
    render(this._container, tripInfoView, RenderPosition.AFTER_BEGIN);
    const routeView = new RouteView(cities, routeDates);
    render(tripInfoView, routeView, RenderPosition.AFTER_BEGIN);
  }

  _getUniqueCities() {
    const cities = [];
    this._points.forEach((point) => {
      if (cities.indexOf(point.destination.name) === -1) {
        cities.push(point.destination.name);
      }
    });
    return cities;
  }

  _getTotalPrice() {
    return this._points.reduce((acc, point) => {
      return acc + point.price;
    }, 0);
  }

  _getRouteDates() {
    const sortedPointsByEndDate = this._points.slice(0).sort((a, b) => b.dates.endDate - a.dates.endDate);
    return [this._points[0].dates.startDate, sortedPointsByEndDate[0].dates.endDate];
  }
}

export default TripInfo;
