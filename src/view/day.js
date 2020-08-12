const getDay = (date, count) => `<li class="trip-days__item day">
                        <div class="day__info">
                          <span class="day__counter">${count + 1}</span>
                          <time class="day__date" datetime="${date.toISOString().slice(0, 10)}">${date.toLocaleDateString(`en-US`, {day: `numeric`, month: `short`})}</time>
                        </div>
                      </li>`.trim();
export {getDay};
