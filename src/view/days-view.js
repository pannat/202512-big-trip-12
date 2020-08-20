import AbstractView from "./abstract-view";
import {getFormattedDate, Format} from "../utils";

class DaysView extends AbstractView {
  constructor(days) {
    super();
    this._days = days;
  }

  getTripPointsLists() {
    return this._element.querySelectorAll(`.trip-events__list`);
  }

  _getTemplate() {
    return `<ul class="trip-days">
                ${this._days.map((day, count) => `<li class="trip-days__item day">
                                        <div class="day__info">
                                          <span class="day__counter">${day ? count + 1 : ``}</span>
                                          <time class="day__date" datetime="${day ? getFormattedDate(day, Format.DATE_SHORT) : ``}">
                                              ${day ? getFormattedDate(day, Format.DATE_SHORT) : ``}
                                          </time>
                                        </div>
                                        <ul class="trip-events__list"></ul>
                                      </li>`).join(``)}
            </ul>`.trim();
  }
}


export default DaysView;

