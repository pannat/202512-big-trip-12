import {getUpperFirst} from "../utils/common";
import {calculateGroup} from "../utils/point";
import {eventTypes, groupToPretext} from "../constants";
import SmartView from "./smart";

import moment from "moment";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const POINT_BLANK = {
  type: `taxi`,
  price: 0,
  dates: {
    startDate: null,
    endDate: null
  },
  destination: {
    name: ``,
    description: ``,
    photos: []
  },
  offers: [],
  isFavorite: false
};

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

const createOffersTemplate = (selectedOffers, key, offersList, isDisabled) => {
  return `<section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                 <div class="event__available-offers">
                  ${offersList.map((offer) => `<div class="event__offer-selector">
                                    <input
                                        class="event__offer-checkbox  visually-hidden"
                                        id="event-offer-${offer.title}-${key}"
                                        type="checkbox"
                                        name="event-offer-${offer.title}"
                                        data-offer-name="${offer.title}"
                                        ${selectedOffers.some((selectedOffer) => selectedOffer.title === offer.title) ? `checked` : ``}
                                        ${isDisabled ? `disabled` : ``}
                                        >
                                    <label class="event__offer-label" for="event-offer-${offer.title}-${key}">
                                      <span class="event__offer-title">${getUpperFirst(offer.title)}</span>
                                      &plus;
                                      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                                    </label>
                                  </div>`)
                    .join(``)}
                </div>
              </section>`;
};

const createDestinationTemplate = (destination) => {
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(``)}
              </div>
            </div>
          </section>`;
};

const createButtonsForEditModeTemplate = (key, isFavorite, isDisabled) => `
    <input
      id="event-favorite-${key}"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox"
      name="event-favorite"
      ${isFavorite ? `Checked` : ``}
      ${isDisabled ? `disabled` : ``}
      >
      <label class="event__favorite-btn" for="event-favorite-${key}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
      </label>
      <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Close event</span>
      </button>`.trim();

const createPointTemplate = ({type, pretext, destination, price, offers, isFavorite, key, isNew, isSaving, isDeleting, isDisabled}, offersList, destinationList) => {
  const typeDisplay = `${getUpperFirst(type)} ${pretext}`;
  const currentCity = destination && destination.name ? destination.name : ``;

  let buttonResetText = `Cancel`;
  if (!isNew) {
    buttonResetText = isDeleting ? `Deleting…` : `Delete`;
  }
  const eventTypeListTemplate = createEventTypesListTemplate(type, key);
  const offersTemplate = offersList && offersList.length ? createOffersTemplate(offers, key, offersList, isDisabled) : ``;
  const destinationTemplate = destination && destination.name ? createDestinationTemplate(destination) : ``;
  const buttonsForEditModeTemplate = isNew ? `` : createButtonsForEditModeTemplate(key, isFavorite, isDisabled);

  const eventDetailsTemplate = offersTemplate || destinationTemplate ?
    `<section class="event__details">
        ${offersTemplate}
        ${destinationTemplate}
    </section>`.trim() : ``;
  const destinationsList = destinationList ? `
            <datalist id="destination-list-${key}">
              ${destinationList.map((destinationItem) => `<option value="${destinationItem.name}"></option>`).join(``)}
            </datalist>`.trim() : ``;


  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${key}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                </label>
                <input
                class="event__type-toggle visually-hidden"
                id="event-type-toggle-${key}"
                type="checkbox"
                ${isDisabled ? `disabled` : ``}>

                <div class="event__type-list">
                  ${eventTypeListTemplate}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-${key}">
                  ${typeDisplay}
                </label>
                <input
                    class="event__input  event__input--destination"
                    id="event-destination-${key}"
                    type="text" name="event-destination"
                    value="${currentCity}"
                    list="destination-list-${key}"
                    ${isDisabled ? `disabled` : ``}
                >
                ${destinationsList}
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
                    ${isDisabled ? `disabled` : ``}
                >
                &mdash;
                <label class="visually-hidden" for="event-end-time-${key}">
                  To
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-end-time-${key}"
                    type="text"
                    name="event-end-time"
                    ${isDisabled ? `disabled` : ``}
                >
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-${key}">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input
                    class="event__input  event__input--price"
                    id="event-price-${key}"
                    type="text"
                    name="event-price"
                    value="${price}"
                    ${isDisabled ? `disabled` : ``}
                >
              </div>

              <button
                class="event__save-btn btn btn--blue"
                type="submit"
                ${isDisabled ? `disabled` : ``}
              >
                ${isSaving ? `Saving…` : `Save`}
              </button>
              <button
                class="event__reset-btn"
                type="reset"
                ${isDisabled ? `disabled` : ``}
              >${buttonResetText}</button>
              ${buttonsForEditModeTemplate}
            </header>
            ${eventDetailsTemplate}
          </form>`.trim();
};

class PointEdit extends SmartView {
  constructor(dictionaries, point = POINT_BLANK) {
    super();
    this._data = PointEdit.parsePointToData(point);
    this._dictionaries = dictionaries;

    this._datepicker = {
      startDate: null,
      endDate: null
    };

    this._offersCorrespondingToType = [];

    this._onButtonCloseClick = this._onButtonCloseClick.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onTypeChange = this._onTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onStartDatePickerChange = this._onStartDatePickerChange.bind(this);
    this._onEndDatePickerChange = this._onEndDatePickerChange.bind(this);
    this._onButtonResetClick = this._onButtonResetClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);
    this.destroyDataPickers = this.destroyDataPickers.bind(this);

    this._setInnerHandlers();
  }

  setOnFormSubmit(callback) {
    this._callback.formSubmit = callback;
  }

  setOnButtonCloseClick(callback) {
    this._callback.buttonCloseClick = callback;
  }

  setOnFavoriteChange(callback) {
    this._callback.favoriteChange = callback;
  }

  setOnButtonResetClick(callback) {
    this._callback.buttonResetClick = callback;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.getElement().addEventListener(`submit`, this._onFormSubmit);
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._onButtonResetClick);

    if (!this._data.isNew) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onButtonCloseClick);
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._onFavoriteChange);
    }
  }

  reset(point) {
    this.updateData(PointEdit.parsePointToData(point));
    this.destroyDataPickers();
  }

  destroyDataPickers() {
    Object.values(this._datepicker)
      .forEach((picker) => {
        if (picker) {
          picker.destroy();
          picker = null;
        }
      });
  }

  _getTemplate() {
    let destinations = [];

    if ((this._dictionaries.offersLists && this._dictionaries.offersLists.length)
      && (this._dictionaries.destinations && this._dictionaries.destinations.length)) {
      const [typeOfOffers] = this._dictionaries.offersLists.filter((list) => list.type === this._data.type);
      this._offersCorrespondingToType = typeOfOffers ? typeOfOffers.offers : [];
      destinations = this._dictionaries.destinations;
    }

    return createPointTemplate(this._data, this._offersCorrespondingToType, destinations);
  }

  _setDatepickers() {
    const formatDate = (date) => moment(date).format(`DD/MM/YYYY HH:mm`);

    this.destroyDataPickers();

    this._datepicker.startDate = flatpickr(
        this.getElement().querySelector(`[name="event-start-time"]`),
        {
          formatDate,
          enableTime: true,
          [`time_24hr`]: true,
          defaultDate: this._data.dates.startDate,
          maxDate: moment(this._data.dates.endDate).subtract(1, `minutes`).valueOf(),
          minuteIncrement: 1,
          onChange: this._onStartDatePickerChange,
        }
    );

    this._datepicker.endDate = flatpickr(
        this.getElement().querySelector(`[name="event-end-time"]`),
        {
          formatDate,
          enableTime: true,
          [`time_24hr`]: true,
          defaultDate: this._data.dates.endDate,
          minDate: moment(this._data.dates.startDate).add(1, `minutes`).valueOf(),
          minuteIncrement: 1,
          onChange: this._onEndDatePickerChange
        }
    );
  }

  _setInnerHandlers() {
    this.getElement().addEventListener(`change`, this._onTypeChange);
    this.getElement().addEventListener(`change`, this._onOffersChange);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._onDestinationChange);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._onPriceChange);
  }

  _validateForm() {
    let isValid = true;
    const priceField = this.getElement().querySelector(`.event__field-group--price`);
    const timeField = this.getElement().querySelector(`.event__field-group--time`);
    const destinationField = this.getElement().querySelector(`.event__field-group--destination`);

    const highlightInvalidField = (field) => {
      field.style.border = `1px solid red`;
      field.style.borderRadius = `4px`;
    };
    const reset = (field) => {
      field.style.border = ``;
      field.style.borderRadius = ``;
    };

    [timeField, priceField, destinationField].forEach((field) => {
      reset(field);
    });

    if (!this._data.dates.startDate || !this._data.dates.endDate) {
      highlightInvalidField(timeField);
      isValid = false;
    }

    if (this._data.price <= 0 || !this._data.price) {
      highlightInvalidField(priceField);
      isValid = false;
    }

    if (!this._data.destination.name) {
      highlightInvalidField(destinationField);
      isValid = false;
    }

    return isValid;
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    if (!this._validateForm()) {
      return;
    }

    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _onButtonCloseClick(evt) {
    evt.preventDefault();
    this._callback.buttonCloseClick();
  }

  _onFavoriteChange(evt) {
    evt.preventDefault();
    this._callback.favoriteChange({isFavorite: !this._data.isFavorite});
  }

  _onTypeChange(evt) {
    if (evt.target.name !== `event-type`) {
      return;
    }

    if (!this._dictionaries.offersLists) {
      return;
    }

    this.updateData({
      type: evt.target.value,
      pretext: groupToPretext[calculateGroup(evt.target.value)],
      offers: []
    });
  }

  _onDestinationChange(evt) {
    const destination = this._dictionaries.destinations ? this._dictionaries.destinations.find((it) => it.name === evt.target.value) : this._data.destination;
    this.updateData({destination});
  }

  _onStartDatePickerChange(value) {
    const startDate = Date.parse(value[0]);

    this._datepicker.endDate.config.minDate = moment(startDate).add(1, `minutes`).valueOf();

    this.updateData({
      dates: {
        startDate,
        endDate: this._data.dates.endDate
      },
    }, true);
  }

  _onEndDatePickerChange(value) {
    let endDate = Date.parse(value[0]);
    this._datepicker.startDate.config.maxDate = moment(endDate).subtract(1, `minutes`).valueOf();

    this.updateData({
      dates: {
        startDate: this._data.dates.startDate,
        endDate
      },
    }, true);
  }

  _onPriceChange(evt) {
    const price = evt.target.value.replace(/\D/g, ``);
    evt.target.value = price;
    this.updateData({
      price
    },
    true);
  }

  _onOffersChange(evt) {
    if (!evt.target.classList.contains(`event__offer-checkbox`)) {
      return;
    }

    let updatedOffers = this._data.offers.slice(0);
    if (evt.target.checked) {
      const currentOffer = this._offersCorrespondingToType.find((offer) => offer.title === evt.target.dataset.offerName);
      if (currentOffer) {
        updatedOffers.push(currentOffer);
      }
    } else {
      const index = updatedOffers.findIndex((offer) => offer.title === evt.target.dataset.offerName);
      if (index > -1) {
        updatedOffers = [...updatedOffers.slice(0, index), ...updatedOffers.slice(index + 1)];
      }
    }

    this.updateData({
      offers: updatedOffers
    });
  }

  _onButtonResetClick() {
    this._callback.buttonResetClick(PointEdit.parsePointToData(this._data));
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isNew: !point.id,
          key: point.id ? point.id : `new`,
          pretext: groupToPretext[calculateGroup(point.type)],
          isSaving: false,
          isDeleting: false,
          isDisabled: false
        }
    );
  }

  static parseDataToPoint(point) {
    const data = Object.assign({}, point);
    delete data.isNew;
    delete data.key;
    delete data.pretext;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.isDisabled;

    return data;
  }
}

export default PointEdit;

