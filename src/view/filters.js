import AbstractView from "./abstract";
import {getUpperFirst} from "../utils";

const createFiltersTemplate = (filterList) =>`
              <form class="trip-filters" action="#" method="get">
                ${filterList.map((filter) => `<div class="trip-filters__filter">
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

class Filters extends AbstractView {
  constructor(filterList) {
    super();
    this._filterList = filterList;
  }

  _getTemplate() {
    return createFiltersTemplate(this._filterList);
  }
}

export default Filters;

