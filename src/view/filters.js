import {getUpperFirst} from "../helpers";

const getFilters = (filters) => `<form class="trip-filters" action="#" method="get">
              ${filters.map((filter) => `<div class="trip-filters__filter">
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

export {getFilters};

