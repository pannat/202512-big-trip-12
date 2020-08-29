import TripInfoView from "../view/trip-info";
import {render, RenderPosition} from "../utils/render";
import Route from "../view/route";

class TripInfo {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
  }

  init() {
    this.renderTripInfo();
  }

  renderTripInfo() {
    const totalPrice = this._getTotalPrice();
    const cities = this._getUniqueCities();
    const routeDates = this._getRouteDates();
    const tripInfoView = new TripInfoView(totalPrice);
    render(this._container, tripInfoView, RenderPosition.AFTER_BEGIN);
    const routeView = new Route(cities, routeDates);
    render(tripInfoView, routeView, RenderPosition.AFTER_BEGIN);
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

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _getTotalPrice() {
    return this._getPoints().reduce((acc, point) => {
      return acc + point.price;
    }, 0);
  }

  _getRouteDates() {
    const sortedPointsByEndDate = this._getPoints().slice(0).sort((a, b) => b.dates.endDate - a.dates.endDate);
    return [this._getPoints()[0].dates.startDate, sortedPointsByEndDate[0].dates.endDate];
  }
}

export default TripInfo;
