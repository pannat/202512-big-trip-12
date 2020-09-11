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

const createChart = (selector, LabelToData, title, formatter) => {
  return new Chart(selector, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(LabelToData),
      datasets: [{
        data: Object.values(LabelToData),
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

    this._setCharts();
  }

  _getTotalMoney(type) {
    return this._points.reduce((acc, point) => {
      let price = point.type === type ? parseInt(point.price, 10) : 0;
      return acc + price;
    }, 0);
  }

  _getTotalDuration(type) {
    return this._points.reduce((acc, point) => {
      let duration = point.type === type ? point.duration : 0;
      return acc + duration;
    }, 0);
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    let types = Object.values(eventTypes);
    types = [...types[0], ...types[1]];

    const TypeToMoney = types.reduce((acc, type) => {
      const money = this._getTotalMoney(type);
      if (money) {
        acc[type.toUpperCase()] = money;
      }
      return acc;
    }, {});

    const TypeToNumberOfTrips = eventTypes.transfer.reduce((acc, type) => {
      const count = this._points.filter((point) => point.type === type).length;
      if (count) {
        acc[type.toUpperCase()] = count;
      }

      return acc;
    }, {});

    const TypeToDuration = types.reduce((acc, type) => {
      const duration = this._getTotalDuration(type);
      if (duration) {
        acc[type.toUpperCase()] = duration;
      }

      return acc;
    }, {});

    createChart(moneyCtx, TypeToMoney, Titles.MONEY, (val) => `€ ${val}`);
    createChart(transportCtx, TypeToNumberOfTrips, Titles.TRANSPORT, (val) => `${val}x`);
    createChart(timeSpendCtx, TypeToDuration, Titles.TIME_SPEND, humanizeDuration);
  }

  _getTemplate() {
    return createStatsTemplate();
  }
}

export default Stats;
