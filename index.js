const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];

class WeatherData {
  constructor(
    currentTemp,
    highTemp,
    lowTemp,
    conditions,
    windSpeed,
    windDirection
  ) {
    this.currentTemp = currentTemp;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
    this.conditions = conditions;
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
  // compass direction for wind
}

const app = (() => {
  // DOM Capture
  const cityForm = document.querySelector(".city-form");

  // functions
  function displayError() {}

  function displayWeather(obj) {}

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
    const currentTemp = data.main.temp;
    const highTemp = data.main.temp_max;
    const lowTemp = data.main.temp_min;
    const conditions = data.weather[0].description;
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;

    return new WeatherData(
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
      console.log(weatherObj);
      displayWeather(weatherObj);
      window.weatherObj = weatherObj;
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
