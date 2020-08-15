import {createElement, getFormattedDate, Format} from "../helpers";

class Days {
  constructor(days) {
    this._days = days;
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
    return `<ul class="trip-days">
                ${this._days.map((day, count) => `<li class="trip-days__item day">
                                        <div class="day__info">
                                          <span class="day__counter">${count + 1}</span>
                                          <time class="day__date" datetime="${getFormattedDate(day, Format.DATE_SHORT)}">
                                              ${getFormattedDate(day, Format.DATE_SHORT)}
                                          </time>
                                        </div>
                                        <ul class="trip-events__list"></ul>
                                      </li>`).join(``)}
            </ul>`.trim();
  }
}


export default Days;

