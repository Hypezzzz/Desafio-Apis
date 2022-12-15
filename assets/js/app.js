const inputClp = document.querySelector("#inputClp");
const inputCurrencies = document.querySelector("#inputCurrencies");
const btnSearch = document.querySelector("#btnSearch");
const conversionResult = document.querySelector("#conversionResult");
const errorDisplay = document.querySelector("#errorDisplay");
const graphLastDays = document.querySelector("#graphLastDays");

let graph;

async function getCurrencyData(selectedCurrency) {
  try {
    const response = await fetch(
      `https://mindicador.cl/api/${selectedCurrency}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la API");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    errorDisplay.textContent = error.message;
  }
}

btnSearch.addEventListener("click", () => {
  const clpValue = inputClp.value;
  const currencyValue = inputCurrencies.value;

  if (clpValue.length === 0) {
    errorDisplay.textContent = "Debe ingresar una cantidad en pesos chilenos";
    return;
  }

  const numValue = +clpValue;

  if (isNaN(numValue) || !isFinite(numValue) || numValue < 0) {
    errorDisplay.textContent =
      "Debe ingresar un número válido (positivo y entero)";
    return;
  }

  getCurrencyData(currencyValue).then((data) => {
    const currencyName = data.nombre;
    const currencyValue = data.serie[0].valor;
    const conversion = (numValue / currencyValue).toFixed(2);

    conversionResult.textContent = `${numValue} CLP equivalen a ${conversion} ${currencyName}`;

    if (graph) {
      graph.destroy();
    }

    graph = new Chart(graphLastDays, {
      type: "line",
      data: {
        labels: data.serie
          .map((item) => item.fecha)
          .slice(0, 10)
          .reverse(),
        datasets: [
          {
            label: "Valor de la moneda en los ultimos 10 dias",
            data: data.serie
              .map((item) => item.valor)
              .slice(0, 10)
              .reverse(),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            tension: 0,
          },
        ],
      },
    });
  });
});
