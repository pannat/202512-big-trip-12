const getRoute = (cities, dates) => {
  const getRouteString = () => {
    if (cities.length) {
      if (cities.length > 3) {
        return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
      }
      return cities.join(` &mdash; `);
    }
    return ``;
  };
  const _route = getRouteString();
  const _dates = dates ? dates.map((date) => date.toLocaleDateString(`en-US`, {day: `numeric`, month: `short`})).join(`&nbsp;&mdash;&nbsp;`) : ``;

  return `<div class="trip-info__main">
              <h1 class="trip-info__title">${_route}</h1>
              <p class="trip-info__dates">${_dates}</p>
            </div>`.trim();
};

export {getRoute};

