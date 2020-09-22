import AbstractView from "./abstract";
import moment from "moment";

const createDayTemplate = (day, number) => {
  const date = day ? moment(day, `ll`).format(`DD MMM`) : ``;
  number = day ? number + 1 : ``;

  return `<li class="trip-days__item day">
            <div class="day__info">
              <span class="day__counter">${number}</span>
              <time class="day__date" datetime="${date}">
                  ${date}
              </time>
            </div>
            <ul class="trip-events__list"></ul>
          </li>`;
};

const createDaysTemplate = (days) => {
  return `<ul class="trip-days">
      ${days.map((day, number) => createDayTemplate(day, number)).join(``)}
    </ul>`.trim();
};

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

