import AbstractView from "./abstract";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {eventTypes} from "../constants";
import {humanizeDuration} from "../utils/point";

const Titles = {
  TIME_SPEND: `TIME-SPEND`,
  TRANSPORT: `TRANSPORT`,
  MONEY: `MONEY`
};

class ChartData {
  constructor() {
    this._labels = [];
    this._data = [];
  }

  getLabels() {
    return this._labels;
  }

  getData() {
    return this._data;
  }

  addLabel(label) {
    this._labels.push(label);
  }

  addData(data) {
    this._data.push(data);
  }
}

const createChart = (selector, chartData, title, formatter) => {
  const labels = chartData.getLabels().map((label) => label.toUpperCase());

  return new Chart(selector, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: chartData.getData(),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatsTemplate = () => `
        <section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`.trim();

class Stats extends AbstractView {
  constructor(points) {
    super();
    this._points = points;

    this._getTotalMoney = this._getTotalMoney.bind(this);
    this._getTotalDuration = this._getTotalDuration.bind(this);
    this._getTotalNumberOfTrips = this._getTotalNumberOfTrips.bind(this);
    this._setCharts();
  }

  _getTotalMoney(type) {
    return this._points.reduce((acc, point) => {
      const price = point.type === type ? parseInt(point.price, 10) : 0;
      return acc + price;
    }, 0);
  }

  _getTotalDuration(type) {
    return this._points.reduce((acc, point) => {
      const duration = point.type === type ? point.duration : 0;
      return acc + duration;
    }, 0);
  }

  _getTotalNumberOfTrips(type) {
    return this._points.filter((point) => point.type === type).length;
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;

    const transformData = (acc, type, callback) => {
      const item = callback(type);
      if (item) {
        acc.addLabel(type);
        acc.addData(item);
      }
      return acc;
    };

    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;


    const typesGroups = Object.values(eventTypes);
    const types = typesGroups.reduce((acc, group) => {
      acc.push(...group);
      return acc;
    }, []);

    const moneyChartData = types.reduce((acc, type) => transformData(acc, type, this._getTotalMoney), new ChartData());

    const transportChartData = eventTypes.transfer.reduce((acc, type) => transformData(acc, type, this._getTotalNumberOfTrips), new ChartData());

    const timeSpendChartData = types.reduce((acc, type) => transformData(acc, type, this._getTotalDuration), new ChartData());

    createChart(moneyCtx, moneyChartData, Titles.MONEY, (val) => `€ ${val}`);
    createChart(transportCtx, transportChartData, Titles.TRANSPORT, (val) => `${val}x`);
    createChart(timeSpendCtx, timeSpendChartData, Titles.TIME_SPEND, humanizeDuration);
  }

  _getTemplate() {
    return createStatsTemplate();
  }
}

export default Stats;
