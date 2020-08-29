import AbstractView from "./abstract";
import moment from "moment";

const createRouteTemplate = (title, dates) => `<div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>
              <p class="trip-info__dates">${dates}</p>
            </div>`.trim();

class Route extends AbstractView {
  constructor(cities, dates) {
    super();
    this._cities = cities;
    this._dates = dates;
  }

  _getDates() {
    return this._dates ? this._dates.map((date) => moment(date).format(`MMM DD`)).join(`&nbsp;&mdash;&nbsp;`) : ``;
  }
  _getTitle() {
    if (this._cities.length) {
      if (this._cities.length > 3) {
        return `${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}`;
      }
      return this._cities.join(` &mdash; `);
    }
    return ``;
  }

  _getTemplate() {
    return createRouteTemplate(this._getTitle(this._cities), this._getDates(this._dates));
  }
}

export default Route;

