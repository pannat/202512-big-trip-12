import AbstractView from "./abstract";
import {getUpperFirst} from "../utils/common";

const createFilterTemplate = (filter, currentFilter) => `
            <div class="trip-filters__filter">
              <input id="filter-${filter}"
                class="trip-filters__filter-input visually-hidden"
                type="radio"
                name="trip-filter"
                value="${filter}"
                ${filter === currentFilter ? `checked` : ``}
              >
              <label class="trip-filters__filter-label" for="filter-${filter}">${getUpperFirst(filter)}</label>
            </div>`.trim();


const createFiltersTemplate = (currentFilter, filterList) =>`
              <form class="trip-filters" action="#" method="get">
                ${filterList.map((filter) => createFilterTemplate(filter, currentFilter)).join(``)}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`.trim();

class Filter extends AbstractView {
  constructor(filterList, currentFilter) {
    super();
    this._filterList = filterList;
    this._currentFilter = currentFilter;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`change`, this._onFilterChange);
  }

  setOnFilterChange(callback) {
    this._callback.filterChange = callback;
  }

  _getTemplate() {
    return createFiltersTemplate(this._currentFilter, this._filterList);
  }

  _onFilterChange(evt) {
    this._callback.filterChange(evt.target.value);
  }
}

export default Filter;

