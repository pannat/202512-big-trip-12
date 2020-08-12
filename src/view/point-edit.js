import {EventTypes, groupToPretext, cities, getUpperFirst, getTime, getDate} from "../helpers";

const DEFAULT_TYPE = `bus`;
const DEFAULT_GROUP = `transfer`;


const getPointEdit = ({id, type, group, destination, dates, price, offers}) => {
  const _id = id;
  const _key = id === null ? `new` : id;
  const _type = type ? type : DEFAULT_TYPE;
  const _group = group ? group : DEFAULT_GROUP;
  const _price = price ? price : ``;

  const getFormattedDate = (date) => `${getDate(date)} ${getTime(date)}`;
  const _startDate = getFormattedDate(dates.startDate);
  const _endDate = getFormattedDate(dates.endDate);

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${_key}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${_type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${_key}" type="checkbox">

                <div class="event__type-list">
                  ${Object.keys(EventTypes).map((eventGroup) => `<fieldset class="event__type-group">
                    <legend class="visually-hidden">${getUpperFirst(eventGroup.toLowerCase())}</legend>
                    ${EventTypes[eventGroup].map((eventType) => `
                    <div class="event__type-item">
                      <input
                        id="event-type-${eventType}-${_id}"
                        class="event__type-input visually-hidden"
                        type="radio"
                        name="event-type"
                        value="${eventType}"
                        ${eventType === _type ? `checked` : ``}
                        >
                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${_key}">
                        ${getUpperFirst(eventType)}
                      </label>
                    </div>`).join(``)}
                  </fieldset>`).join(``)}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-${_key}">
                  ${getUpperFirst(_type)} ${groupToPretext[_group]}
                </label>
                <input class="event__input  event__input--destination"
                    id="event-destination-${_key}"
                    type="text" name="event-destination"
                    value="${destination.name}"
                    list="destination-list-${_key}"
                >
                <datalist id="destination-list-${_key}">
                  ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-${_key}">
                  From
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-start-time-${_key}"
                    type="text"
                    name="event-start-time"
                    value="${_startDate}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-${_key}">
                  To
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-end-time-${_key}"
                    type="text"
                    name="event-end-time"
                    value="${_endDate}"
                >
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-${_key}">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-${_key}" type="text" name="event-price" value="${_price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
            ${offers.length || destination.name ? `<section class="event__details">
                ${offers.length ? `<section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                 <div class="event__available-offers">
                  ${offers.map((offer) => `<div class="event__offer-selector">
                    <input
                        class="event__offer-checkbox  visually-hidden"
                        id="event-offer-${offer.name}-${_key}"
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
              ${destination.name ? `
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${destination.description}</p>
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${destination.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
                  </div>
                </div>
              </section>` : ``}` : ``}
            </section>
          </form>`.trim();
};

export {getPointEdit};

