import AbstractView from "./abstract";

const createFilterTemplate = (filter, currentFilter) => `
            <div class="trip-filters__filter">
              <input id="filter-${filter.name}"
                class="trip-filters__filter-input visually-hidden"
                type="radio"
                name="trip-filter"
                value="${filter.name}"
                ${filter.name === currentFilter ? `checked` : ``}
                ${filter.isDisabled ? `disabled` : ``}
              >
              <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
            </div>`.trim();


const createFiltersTemplate = (currentFilter, filters) =>`
              <form class="trip-filters" action="#" method="get">
                ${filters.map((filter) => createFilterTemplate(filter, currentFilter)).join(``)}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`.trim();

class Filter extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  setOnFilterChange(callback) {
    this._callback.filterChange = callback;
  }

  restoreHandlers() {
    this.getElement().addEventListener(`change`, this._onFilterChange);
  }

  _getTemplate() {
    return createFiltersTemplate(this._currentFilter, this._filters);
  }

  _onFilterChange(evt) {
    this._callback.filterChange(evt.target.value);
  }
}

export default Filter;

