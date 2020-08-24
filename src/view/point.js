import {getUpperFirst, getFormattedDate, Format, calculateGroup, groupToPretext} from "../utils";
import AbstractView from "./abstract";

const createPointTemplate = (type, pretext, destination, startDate, endDate, price, offers) => `
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${getUpperFirst(type)} ${pretext} ${getUpperFirst(destination.name)}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${startDate.toISOString()}">${getFormattedDate(startDate, Format.TIME, false)}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${endDate.toISOString()}">${getFormattedDate(endDate, Format.TIME, false)}</time>
                      </p>
                      <p class="event__duration">30M</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${price}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${offers.map((offer) => `<li class="event__offer">
                        <span class="event__offer-title">${offer.displayName}</span>
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
    this._startDate = dates.startDate;
    this._endDate = dates.endDate;
    this._price = price;
    this._offers = offers;

    this._onButtonClick = this._onButtonClick.bind(this);
  }

  setOnButtonClick(callback) {
    this._callback.clickButton = callback;
  }

  restoreHandlers() {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onButtonClick);
  }

  _getTemplate() {
    return createPointTemplate(this._type, this._pretext, this._destination, this._startDate, this._endDate, this._price, this._offers);
  }

  _onButtonClick(evt) {
    evt.preventDefault();

    this._callback.clickButton();
  }
}

export default Point;

