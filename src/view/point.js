import {getUpperFirst, groupToPretext, getFormattedDate, createElement, Format} from "../helpers";

class Point {
  constructor({type, group, destination, dates, price, offers}) {
    this._type = type;
    this._group = group;
    this._destination = destination;
    this._startDate = dates.startDate;
    this._endDate = dates.endDate;
    this._price = price;
    this._offers = offers;
    this._element = null;

    this._onRollupButton = null;
  }

  setOnRollupButton(fn) {
    this._onRollupButton = fn;
  }

  setHandlers() {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onRollupButton);
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
    return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${getUpperFirst(this._type)} ${groupToPretext[this._group]} ${getUpperFirst(this._destination.name)}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${this._startDate.toISOString()}">${getFormattedDate(this._startDate, Format.TIME, false)}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${this._endDate.toISOString()}">${getFormattedDate(this._endDate, Format.TIME, false)}</time>
                      </p>
                      <p class="event__duration">30M</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${this._price}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${this._offers.map((offer) => `<li class="event__offer">
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
  }
}

export default Point;

