import AbstractView from "./abstract";
import {getUpperFirst} from "../utils/common";
import {SortType} from "../constants";

const createSortTemplate = (currentSortType) => {
  const sortTypes = Object.values(SortType);
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
              <span class="trip-sort__item  trip-sort__item--day">Day</span>
              ${sortTypes.map((type) => `
                <div class="trip-sort__item  trip-sort__item--${type}">
                <input id="sort-${type}"
                  data-sort-type="${type}"
                  class="trip-sort__input visually-hidden"
                  type="radio" name="trip-sort"
                  value="sort-${type}"
                  ${type === currentSortType ? `checked` : ``}
                >
                <label class="trip-sort__btn" for="sort-${type}">
                  ${getUpperFirst(type)}
                </label>
              </div>`).join(``).trim()}
              <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>`.trim();
};

class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
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
    return createSortTemplate(this._currentSortType);
  }
}

export default Sort;
