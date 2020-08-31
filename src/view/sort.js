import AbstractView from "./abstract";
import {getUpperFirst} from "../utils/common";

const createSortTemplate = (sortingTypes) => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
              <span class="trip-sort__item  trip-sort__item--day">Day</span>
              ${sortingTypes.map((type) => `<div class="trip-sort__item  trip-sort__item--${type.name}">
                <input id="sort-${type.name}"
                  data-sort-type="${type.name}"
                  class="trip-sort__input visually-hidden"
                  type="radio" name="trip-sort"
                  value="sort-${type.name}"
                  ${type.isApply ? `checked` : ``}
                >
                <label class="trip-sort__btn" for="sort-${type.name}">
                  ${getUpperFirst(type.name)}
                  ${type.direction ? `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                  </svg>` : `` }
                </label>
              </div>`).join(``)}

              <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>`.trim();

class Sort extends AbstractView {
  constructor(sortingTypes) {
    super();
    this._sortingTypes = sortingTypes;

    this._onSortChange = this._sortTypeChangeHandler.bind(this);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`change`, this._onSortChange);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortChange = callback;
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortChange(evt.target.dataset.sortType);
  }

  _getTemplate() {
    return createSortTemplate(this._sortingTypes);
  }
}

export default Sort;
