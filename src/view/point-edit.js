import {cities, eventTypes, getUpperFirst, calculateGroup, groupToPretext} from "../utils";
import SmartView from "./smart";

import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

import {additionalOptions} from "../mock";

const POINT_BLANK = {
  id: null,
  type: ``,
  price: null,
  dates: {
    startDate: new Date(),
    endDate: new Date()
  },
  destination: {
    name: ``,
    description: ``,
    photos: []
  },
  offers: []
};

const FORMAT_DATEPICKER = `d/j/Y H:S`;

const createEventTypesListTemplate = (currentType, key) => `
                  ${Object.keys(eventTypes).map((eventGroup) => `<fieldset class="event__type-group">
                    <legend class="visually-hidden">${getUpperFirst(eventGroup.toLowerCase())}</legend>
                    ${eventTypes[eventGroup].map((eventType) => `
                    <div class="event__type-item">
                      <input
                        id="event-type-${eventType}-${key}"
                        class="event__type-input visually-hidden"
                        type="radio"
                        name="event-type"
                        value="${eventType}"
                        ${eventType === currentType ? `checked` : ``}
                        >
                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${key}">
                        ${getUpperFirst(eventType)}
                      </label>
                    </div>`).join(``)}
                  </fieldset>`)
                  .join(``)
                  .trim()}`;

const createOffersTemplate = (offers, key) => {
  if (!offers || !offers.length) {
    return ``;
  }

  return `<section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                 <div class="event__available-offers">
                  ${offers.map((offer) => `<div class="event__offer-selector">
                                    <input
                                        class="event__offer-checkbox  visually-hidden"
                                        id="event-offer-${offer.name}-${key}"
                                        type="checkbox"
                                        name="event-offer-${offer.name}"
                                        ${offer.isApply ? `checked` : ``}>
                                    <label class="event__offer-label" for="event-offer-${offer.name}-${key}">
                                      <span class="event__offer-title">${getUpperFirst(offer.displayName)}</span>
                                      &plus;
                                      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                                    </label>
                                  </div>`)
                    .join(``)}
                </div>
              </section>`;
};

const createDestinationTemplate = (destination) => {
  if (!destination || !destination.name.trim()) {
    return ``;
  }

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destination.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
              </div>
            </div>
          </section>`;
};

const createPointTemplate = ({type, pretext, destination, dates, price, offers, isFavorite, key, isNew}) => {
  const eventTypeListTemplate = createEventTypesListTemplate(type, key);
  const offersTemplate = createOffersTemplate(offers, key);
  const destinationTemplate = createDestinationTemplate(destination);

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${key}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${key}" type="checkbox">

                <div class="event__type-list">
                  ${eventTypeListTemplate}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-${key}">
                  ${getUpperFirst(type)} ${pretext}
                </label>
                <input class="event__input  event__input--destination"
                    id="event-destination-${key}"
                    type="text" name="event-destination"
                    value="${destination.name ? destination.name : ``}"
                    list="destination-list-${key}"
                >
                <datalist id="destination-list-${key}">
                  ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-${key}">
                  From
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-start-time-${key}"
                    type="text"
                    name="event-start-time"
                    value="${dates.startDate}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-${key}">
                  To
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-end-time-${key}"
                    type="text"
                    name="event-end-time"
                    value="${dates.endDate}"
                >
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-${key}">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-${key}" type="text" name="event-price" value="${price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">${isNew ? `Cancel` : `Delete`}</button>
              ${isNew ? `` : `<input
                id="event-favorite-${key}"
                class="event__favorite-checkbox  visually-hidden"
                type="checkbox"
                name="event-favorite"
                ${isFavorite ? `Checked` : ``}
                >
              <label class="event__favorite-btn" for="event-favorite-${key}">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </label>

              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Close event</span>
              </button>`}
            </header>
            ${offers.length || destination.name ? `
              <section class="event__details">
                  ${offersTemplate}
                  ${destinationTemplate}
              </section>` : ``}
          </form>`.trim();
};

class PointEdit extends SmartView {
  constructor(point = POINT_BLANK) {
    super();
    this._data = PointEdit.parsePointToData(point);
    this._datepicker = {
      startDate: null,
      endDate: null
    };
    this._onButtonCloseClick = this._onButtonCloseClick.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onTypeChange = this._onTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onStartDatePickerChange = this._onStartDatePickerChange.bind(this);
    this._onEndDatePickerChange = this._onEndDatePickerChange.bind(this);

    this._setInnerHandlers();
  }

  setOnFormSubmit(callback) {
    this._callback.formSubmit = callback;
  }

  setOnButtonCloseClick(callback) {
    this._callback.closeButtonClick = callback;
  }

  setOnFavoriteChange(callback) {
    this._callback.favoriteChange = callback;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.getElement().addEventListener(`submit`, this._onFormSubmit);
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onButtonCloseClick);
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._onFavoriteChange);
  }

  reset(point) {
    this.updateData(PointEdit.parsePointToData(point));
  }

  _getTemplate() {
    return createPointTemplate(this._data);
  }

  _setDatepickers() {
    Object.values(this._datepicker)
      .forEach((picker) => {
        if (picker) {
          picker.destroy();
          picker = null;
        }
      });

    this._datepicker.startDate = flatpickr(
        this.getElement().querySelector(`[name="event-start-time"]`),
        {
          dateFormat: FORMAT_DATEPICKER,
          enableTime: true,
          defaultDate: this._data.dates.startDate,
          onChange: this._onStartDatePickerChange
        }
    );

    this._datepicker.endDate = flatpickr(
        this.getElement().querySelector(`[name="event-end-time"]`),
        {
          dateFormat: FORMAT_DATEPICKER,
          enableTime: true,
          defaultDate: this._data.dates.endDate,
          onChange: this._onEndDatePickerChange
        }
    );
  }

  _setInnerHandlers() {
    this.getElement().addEventListener(`change`, this._onTypeChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._onDestinationChange);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _onButtonCloseClick(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
    Object.values(this._datepicker).forEach((datepicker) => {
      datepicker.destroy();
      datepicker = null;
    });
  }

  _onFavoriteChange(evt) {
    evt.preventDefault();
    this._callback.favoriteChange();
  }

  _onTypeChange(evt) {
    if (evt.target.name !== `event-type`) {
      return;
    }

    this.updateData({
      type: evt.target.value,
      pretext: groupToPretext[calculateGroup(evt.target.value)],
      offers: additionalOptions[calculateGroup(evt.target.value)]
    });
  }

  _onDestinationChange(evt) {
    this.updateData({
      destination: {
        name: evt.target.value,
        description: `New new new`,
        photos: []
      }
    });
  }

  _onStartDatePickerChange(value) {
    this.updateData({
      dates: {
        startDate: value,
        endDate: this._data.dates.endDate
      },
    }, true);
  }

  _onEndDatePickerChange(value) {
    this.updateData({
      dates: {
        startDate: this._data.dates.startDate,
        endDate: value
      },
    }, true);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isNew: point.id === null,
          key: point.id === null ? `new` : point.id,
          pretext: groupToPretext[calculateGroup(point.type)]
        }
    );
  }

  static parseDataToPoint(point) {
    const data = Object.assign({}, point);
    delete data.isNew;
    delete data.key;
    delete data.pretext;
    return data;
  }
}

export default PointEdit;
