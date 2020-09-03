import moment from "moment";
import {getUpperFirst} from "../utils/common";
import {calculateGroup} from "../utils/point";
import {groupToPretext} from "../constants";
import AbstractView from "./abstract";

const createPointTemplate = (type, pretext, destination, startDate, endDate, duration, price, offers) => `
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${getUpperFirst(type)} ${pretext} ${getUpperFirst(destination.name)}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${startDate.toISOString()}">${startDate.format(`hh:mm`)}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${endDate.toISOString()}">${endDate.format(`hh:mm`)}</time>
                      </p>
                      <p class="event__duration">${duration}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${price}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${offers.map((offer) => `<li class="event__offer">
                        <span class="event__offer-title">${offer.title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                       </li>`).join(``)}
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`.trim();

class Point extends AbstractView {
  constructor({type, destination, dates, price, offers}) {
    super();
    this._type = type;
    this._pretext = groupToPretext[calculateGroup(type)];
    this._destination = destination;
    this._startDate = moment(dates.startDate);
    this._endDate = moment(dates.endDate);
    this._duration = this._calculateDuration();
    this._price = price;
    this._offers = offers.slice(0, 3);
    this._onButtonClick = this._onButtonClick.bind(this);
  }
  setOnButtonClick(callback) {
    this._callback.clickButton = callback;
  }

  restoreHandlers() {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onButtonClick);
  }

  _getTemplate() {
    return createPointTemplate(this._type, this._pretext, this._destination, this._startDate, this._endDate, this._duration, this._price, this._offers);
  }

  _calculateDuration() {
    const setFormatUnitTime = (unit) => unit > 9 ? unit : `0${unit}`;
    const diff = this._endDate.diff(this._startDate);

    const days = setFormatUnitTime(moment.duration(diff).days());
    const hours = setFormatUnitTime(moment.duration(diff).hours());
    const minutes = setFormatUnitTime(moment.duration(diff).minutes());

    let duration = ``;

    if (parseInt(days, 10)) {
      duration += `${days}D ${hours}H`;
    } else if (parseInt(hours, 10)) {
      duration += `${hours}H`;
    }
    duration += ` ${minutes}M`;

    return duration;
  }

  _onButtonClick(evt) {
    evt.preventDefault();

    this._callback.clickButton();
  }
}

export default Point;

