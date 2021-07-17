const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];

class WeatherData {
  constructor(
    city,
    currentTemp,
    highTemp,
    lowTemp,
    conditions,
    windSpeed,
    windDirection
  ) {
    this.city = city;
    this.currentTemp = Math.round(currentTemp);
    this.highTemp = Math.round(highTemp);
    this.lowTemp = Math.round(lowTemp);
    this.conditions = conditions.charAt(0).toUpperCase() + conditions.slice(1);
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
  }

  get compassDirection() {
    return this.calcWindDirection();
  }

  calcWindDirection() {
    const direction = Math.round(this.windDirection / 45) + 1;
    return windDirections[direction];
  }

  // methods to fahrenheit conversion
}

const app = (() => {
  // DOM Capture
  const cityForm = document.querySelector(".city-form");

  // functions
  function displayError() {}

  function displayWeather(obj) {
    console.log(obj);
    const city = document.querySelector(".weather__city");
    city.innerText = obj.city;

    const currentTemp = document.querySelector(".weather__temp");
    currentTemp.innerText = obj.currentTemp;

    const conditions = document.querySelector(".weather__conditions");
    conditions.innerText = obj.conditions;

    const high = document.querySelector(".weather__high");
    high.innerText = "High: " + obj.highTemp;

    const low = document.querySelector(".weather__low");
    low.innerText = "Low: " + obj.lowTemp;

    const wind = document.querySelector(".weather__wind");
    wind.innerText = `Wind: ${obj.windSpeed} mph, ${obj.compassDirection}`;
  }

  function fetchWeather(city) {
    return fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=2cb1f67211afcc04ab3cde6076c7190a&units=imperial`
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error();
        }
        return response;
      })
      .then(function (response) {
        return response.json();
      })
      .catch(function (error) {
        return error;
      });
  }

  function makeWeatherObject(data) {
    const city = data.name;
    const currentTemp = data.main.temp;
    const highTemp = data.main.temp_max;
    const lowTemp = data.main.temp_min;
    const conditions = data.weather[0].description;
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;

    return new WeatherData(
      city,
      currentTemp,
      highTemp,
      lowTemp,
      conditions,
      windSpeed,
      windDirection
    );
  }

  function processData(input) {
    const weatherJSON = fetchWeather(input);
    weatherJSON.then((data) => {
      if (data instanceof Error) {
        displayError();
        return;
      }
      const weatherObj = makeWeatherObject(data);
      displayWeather(weatherObj);
    });
  }

  // Event Listeners

  cityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = cityForm.city.value;
    processData(input);
  });

  // init
  processData("Detroit");
})();
