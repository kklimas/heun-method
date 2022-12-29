const f1 = (x) => 1 / (1 - x ** 2);
const f2 = (x) => x + 1;
const f3 = (x) => (4 * x ** 3 + 2) / (x ** 4 + 2 * x);

const d1 = (x, y) => 2 * x ** 3 * y ** 2 + 2 * x * y;
const d2 = (x, y) => y / (x + 1);
const d3 = (x, y) => (-1 * (x * y - 2) ** 2) / x ** 2;

const setup = () => {
  ex(0, 1, 1, f1, d1, 0);
  ex(0, 1, 1, f2, d2, 1);
  ex(1, 2, 10, f3, d3, 2);
};

const ex = (x0, y0, xn, f, d, index) => {
  const steps = [0.1, 0.01, 0.001];
  const differences = [];

  steps.forEach((step, i) => {
    const X = linspace(x0, xn, step);
    const Y1 = X.map((x) => f(x));
    const Y2 = heun(x0, y0, xn, step, d);
    const chartId = `ex-${index}-${i}`;

    // draw chart
    new Chart(chartId, {
      type: "line",
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: `Zależność y(x) dla kroku ${step}`,
        },
      },
      data: {
        labels: X,
        datasets: [
          {
            borderColor: "red",
            data: Y1,
            fill: false,
            label: "Prawidłowy wynik",
          },
          {
            borderColor: "blue",
            data: Y2,
            fill: false,
            label: "Wynik metody",
          },
        ],
      },
    });
    // get difference
    let diff = 0;
    for (let i = 0; i < Y1.length; i++) {
      diff = Math.max(Math.abs(Y2.at(i) - Y1.at(i)));
    }
    differences.push(diff);
  });

  // draw differences chart
  const barColors = ["red", "green", "blue"];
  new Chart(`ex-${index}-3`, {
    type: "bar",
    data: {
      labels: [0.1, 0.01, 0.001],
      datasets: [
        {
          backgroundColor: barColors,
          data: differences,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Wartości błędów dla kolejnych kroków",
      },
    },
  });
};

const linspace = (start, end, step) => {
  let arr = [];
  while (start < end) {
    let num = Number(start);
    let roundedString = num.toFixed(6);
    start = Number(roundedString);
    arr.push(start);
    start += step;
  }
  return arr;
};

const heun = (x0, y0, stop, step, d) => {
  let xi = x0;
  let yi = y0;

  let xdata = [];
  let ydata = [];

  while (xi < stop) {
    let s1 = d(xi, yi);
    let s2 = d(xi + step, yi + d(xi, yi) * step);

    let delta = (step * (s1 + s2)) / 2;

    xdata.push(xi);
    ydata.push(yi);

    yi = yi + delta;
    xi += step;
  }
  return ydata;
};

setup();
