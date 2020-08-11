import {EventTypes, groupToPretext, cities, getUpperFirst} from "../helpers";

const format = {
  year: `numeric`,
  month: `numeric`,
  day: `numeric`,
  hour: `numeric`,
  minute: `numeric`,
  hour12: false
};

const getPointEdit = ({id, type, group, destination, dates}) => `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                <div class="event__type-list">
                  ${Object.keys(EventTypes).map((eventGroup) => `<fieldset class="event__type-group">
                    <legend class="visually-hidden">${getUpperFirst(eventGroup.toLowerCase())}</legend>
                    ${EventTypes[eventGroup].map((eventType) => `
                    <div class="event__type-item">
                      <input
                        id="event-type-${eventType}-${id}"
                        class="event__type-input  visually-hidden"
                        type="radio"
                        name="event-type"
                        value="${eventType}"
                        ${eventType === type ? `checked` : ``}
                        >
                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${id}">
                        ${getUpperFirst(eventType)}
                      </label>
                    </div>`).join(``)}
                  </fieldset>`).join(``)}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-${id}">
                  ${getUpperFirst(type)} ${groupToPretext[group]}
                </label>
                <input class="event__input  event__input--destination"
                    id="event-destination-${id}"
                    type="text" name="event-destination"
                    value="${destination.name}"
                    list="destination-list-${id}"
                >
                <datalist id="destination-list-${id}">
                  ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-${id}">
                  From
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-start-time-${id}"
                    type="text"
                    name="event-start-time"
                    value="${dates.startDate.toLocaleDateString(`en-US`, format)}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-${id}">
                  To
                </label>
                <input
                    class="event__input  event__input--time"
                    id="event-end-time-${id}"
                    type="text"
                    name="event-end-time"
                    value="18/03/19 00:00"
                >
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
                    <label class="event__offer-label" for="event-offer-luggage-1">
                      <span class="event__offer-title">Add luggage</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">30</span>
                    </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
                    <label class="event__offer-label" for="event-offer-comfort-1">
                      <span class="event__offer-title">Switch to comfort class</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">100</span>
                    </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
                    <label class="event__offer-label" for="event-offer-meal-1">
                      <span class="event__offer-title">Add meal</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">15</span>
                    </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
                    <label class="event__offer-label" for="event-offer-seats-1">
                      <span class="event__offer-title">Choose seats</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">5</span>
                    </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
                    <label class="event__offer-label" for="event-offer-train-1">
                      <span class="event__offer-title">Travel by train</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">40</span>
                    </label>
                  </div>
                </div>
              </section>

              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>

                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
                    <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
                    <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
                    <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
                    <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
                  </div>
                </div>
              </section>
            </section>
          </form>`.trim();

export {getPointEdit};

