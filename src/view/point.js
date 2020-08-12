import {getUpperFirst, groupToPretext, getTime} from "../helpers";

const getPoint = ({type, group, destination, dates, price, offers}) => `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${getUpperFirst(type)} ${groupToPretext[group]} ${getUpperFirst(destination.name)}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${dates.startDate.toISOString()}">${getTime(dates.startDate)}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${dates.endDate.toISOString()}">${getTime(dates.endDate)}</time>
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

export {getPoint};

