import {createElement, getFormattedDate, Format} from "../helpers";

class Route {
  constructor(cities, dates) {
    this._cities = cities;
    this._dates = dates;
    this._element = null;
  }

  getElement() {
    if (this._element) {
      return this._element;
    }
    this._element = createElement(this._getTemplate());

    return this._element;
  }

  removeElement() {
    this._element.remove();
    this._element = null;
  }

  _getDates() {
    return this._dates ? this._dates.map((date) => getFormattedDate(date, Format.DATE_SHORT)).join(`&nbsp;&mdash;&nbsp;`) : ``;
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
    return `<div class="trip-info__main">
              <h1 class="trip-info__title">${this._getTitle()}</h1>
              <p class="trip-info__dates">${this._getDates()}</p>
            </div>`.trim();
  }
}

export default Route;

