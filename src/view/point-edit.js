import {EventTypes, groupToPretext, cities, getUpperFirst, getFormattedDate, Format, createElement} from "../helpers";

const DEFAULT_TYPE = `bus`;
const DEFAULT_GROUP = `transfer`;

class PointEdit {
  constructor({id, type, group, destination, dates, price, offers}) {
    this._key = id === null ? `new` : id;
    this._type = type ? type : DEFAULT_TYPE;
    this._group = group ? group : DEFAULT_GROUP;
    this._price = price ? price : ``;
    this._startDate = dates.startDate;
    this._endDate = dates.endDate;
    this._destination = destination;
    this._offers = offers;
    this._element = null;
    this._onCloseButton = null;
    this._onSubmitForm = null;
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

  setOnCloseButton(fn) {
    this._onCloseButton = fn;
  }

  setOnSubmitForm(fn) {
    this._onSubmitForm = (evt) => {
      evt.preventDefault();
      fn();
    };
  }

  setHandlers() {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._onCloseButton);
    this.getElement().addEventListener(`submit`, this._onSubmitForm);
  }

  _getDateForCalendar(date) {
    return `${getFormattedDate(date, Format.DATE_LONG)} ${getFormattedDate(date, Format.TIME, false)}`;
  }

  _getTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${this._key}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._key}" type="checkbox">

                <div class="event__type-list">
                  ${Object.keys(EventTypes).map((eventGroup) => `<fieldset class="event__type-group">
                    <legend class="visually-hidden">${getUpperFirst(eventGroup.toLowerCase())}</legend>
                    ${EventTypes[eventGroup].map((eventType) => `
                    <div class="event__type-item">
                      <input
                        id="event-type-${eventType}-${this._key}"
                        class="event__type-input visually-hidden"
                        type="radio"
                        name="event-type"
                        value="${eventType}"
                        ${eventType === this._type ? `checked` : ``}
                        >
                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${this._key}">
                        ${getUpperFirst(eventType)}
                      </label>
                    </div>`).join(``)}
                  </fieldset>`).join(``)}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-${this._key}">
                  ${getUpperFirst(this._type)} ${groupToPretext[this._group]}
                </label>
                <input class="event__input  event__input--destination"
                    id="event-destination-${this._key}"
                    type="text" name="event-destination"
                    value="${this._destination.name}"
                    list="destination-list-${this._key}"
                >
                <datalist id="destination-list-${this._key}">
                  ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-${this._key}">
                  From
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-start-time-${this._key}"
                    type="text"
                    name="event-start-time"
                    value="${this._getDateForCalendar(this._startDate)}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-${this._key}">
                  To
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-end-time-${this._key}"
                    type="text"
                    name="event-end-time"
                    value="${this._getDateForCalendar(this._endDate)}"
                >
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-${this._key}">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-${this._key}" type="text" name="event-price" value="${this._price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
            ${this._offers.length || this._destination.name ? `<section class="event__details">
                ${this._offers.length ? `<section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                 <div class="event__available-offers">
                  ${this._offers.map((offer) => `<div class="event__offer-selector">
                    <input
                        class="event__offer-checkbox  visually-hidden"
                        id="event-offer-${offer.name}-${this._key}"
                        type="checkbox"
                        name="event-offer-${offer.name}"
                        ${offer.isApply ? `checked` : ``}>
                    <label class="event__offer-label" for="event-offer-${offer.name}-1">
                      <span class="event__offer-title">${getUpperFirst(offer.displayName)}</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                    </label>
                  </div>`).join(``)}
                </div>` : ``}
              </section>
              ${this._destination.name ? `
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${this._destination.description}</p>
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${this._destination.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
                  </div>
                </div>
              </section>` : ``}` : ``}
            </section>
          </form>`.trim();
  }
}

export default PointEdit;

