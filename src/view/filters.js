import {createElement, getUpperFirst} from "../helpers";

class Filters {
  constructor(filterList) {
    this._filterList = filterList;
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

  _getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
                ${this._filterList.map((filter) => `<div class="trip-filters__filter">
                  <input id="filter-${filter.name}"
                  class="trip-filters__filter-input visually-hidden"
                  type="radio"
                  name="trip-filter"
                  value="${filter.name}"
                  ${filter.isApply ? `checked` : ``}
                  >
                  <label class="trip-filters__filter-label" for="filter-${filter.name}">${getUpperFirst(filter.name)}</label>
                </div>`).join(``)}

                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`.trim();
  }
}

export default Filters;

