const overlay = document.querySelector(".overlay");
const inputModal = document.querySelector("#input-modal");
const closeOptionsButton = document.querySelector(".btn-close");
const openOptionsButton = document.querySelector("#btn-open-options");
const modalForm = document.querySelector("#modal-form");
const graphDiv = document.querySelector("#graph-div");
const submitButton = document.querySelector("#btn-submit");

let fetchedData = false;

const openModal = function () {
  inputModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  closeOptionsButton.classList.remove("hidden");
  submitButton.textContent = "Submit";
};

const closeModal = function () {
  if (fetchedData) {
    inputModal.classList.add("hidden");
    overlay.classList.add("hidden");
  }
};

overlay.addEventListener("click", closeModal);
closeOptionsButton.addEventListener("click", closeModal);

openOptionsButton.addEventListener("click", openModal);

modalForm.addEventListener("submit", () => {
  event.preventDefault();
  submitButton.textContent = "Loading...";

  const formdata = new FormData(modalForm);
  const requestData = {};
  for (let pair of formdata.entries()) {
    requestData[pair[0]] = pair[1];
  }
  console.log(requestData);
  fetch(
    `https://dca-crypto.herokuapp.com/dca/query?coin=${requestData.coin}&deposit=${requestData.deposit}&currency=${requestData.currency}&frequency=${requestData.frequency}&startdate=${requestData.startDate}`
  )
    .then((response) => {
      response.json().then((data) => {
        fetchedData = true;

        let avgBuy = {
          // x: ["2013-10-4", "2013-10-5", "2013-10-6", "2013-10-7"],
          // y: [10, 15, 13, 17],
          x: [],
          y: [],
          name: "Average Buy",
          type: "scatter",
        };

        for (const date in data.avg_portfolio) {
          avgBuy.x.push(date);
          avgBuy.y.push(data.avg_portfolio[date]);
        }

        let bulkBuy = {
          // x: ["2013-10-4", "2013-10-5", "2013-10-6", "2013-10-7"],
          // y: [16, 5, 11, 9],
          x: [],
          y: [],
          name: "Bulk Buy",
          type: "scatter",
        };

        for (const date in data.single_buy_portfolio) {
          bulkBuy.x.push(date);
          bulkBuy.y.push(data.single_buy_portfolio[date]);
        }

        let layout = {
          colorway: ["#33cc66", "#33CCB3"],
          title: {
            text: "Dollar Cost Averaging vs Bulk Buying",
            font: {
              family: "Roboto, sans-serif",
              size: 24,
            },
          },
          legend: {
            orientation: "h",
            font: {
              size: 16,
            },
          },
          xaxis: {
            title: {
              text: "Date",
            },
          },
          yaxis: {
            title: {
              text: requestData.currency,
            },
          },
        };

        var plotData = [avgBuy, bulkBuy];
        Plotly.newPlot(graphDiv, plotData, layout, {
          responsive: true,
          displayModeBar: false,
        });
        closeModal();
      });
    })
    .catch((err) => {
      submitButton.textContent = "Submit";
      document.querySelector("#error-message").textContent = err;
    });
});
