import AbstractView from "./abstract";
import {getFormattedDate, Format} from "../utils";

const createDaysTemplate = (days) => `
              <ul class="trip-days">
                ${days.map((day, count) => `<li class="trip-days__item day">
                                        <div class="day__info">
                                          <span class="day__counter">${day ? count + 1 : ``}</span>
                                          <time class="day__date" datetime="${day ? getFormattedDate(day, Format.DATE_SHORT) : ``}">
                                              ${day ? getFormattedDate(day, Format.DATE_SHORT) : ``}
                                          </time>
                                        </div>
                                        <ul class="trip-events__list"></ul>
                                      </li>`).join(``)}
              </ul>`.trim();

class Days extends AbstractView {
  constructor(days) {
    super();
    this._days = days;
  }

  getTripPointsLists() {
    return this._element.querySelectorAll(`.trip-events__list`);
  }

  _getTemplate() {
    return createDaysTemplate(this._days);
  }
}


export default Days;

