const getDay = (date, count) => `<li class="trip-days__item day">
                        <div class="day__info">
                          <span class="day__counter">${count + 1}</span>
                          <time class="day__date" datetime="2019-03-18">${date.toLocaleDateString(`en-US`, {day: `numeric`, month: `short`})}</time>
                        </div>
                      </li>`.trim();
export {getDay};
