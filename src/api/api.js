import PointModel from "../model/points";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((points) => points.map(PointModel.adaptToClient));
  }

  addPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((updatedPoint) => PointModel.adaptToClient(updatedPoint));
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((updatedPoint) => PointModel.adaptToClient(updatedPoint));
  }

  deletePoint(id) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  syncPoints(points) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(points),
      headers: new Headers({"Content-Type": `application/json`})
    });
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}:${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

export default Api;
