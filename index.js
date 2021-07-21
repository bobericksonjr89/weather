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
    this.windSpeed = Math.round(windSpeed);
    this.windDirection = windDirection;
  }

  get compassDirection() {
    return this.calcWindDirection();
  }

  calcWindDirection() {
    const direction = Math.round(this.windDirection / 45) + 1;
    if (direction == 9) {
      return "N";
    }
    return windDirections[direction];
  }

  calcCelsius(temp) {
    return Math.round(((temp - 32) * 5) / 9);
  }

  calcWindSpeed() {
    return Math.round(this.windSpeed * 1.609);
  }
}

const app = (() => {
  // DOM Capture
  const message = document.querySelector(".weather__message");
  const city = document.querySelector(".weather__city");
  const currentTemp = document.querySelector(".weather__temp");
  const conditions = document.querySelector(".weather__conditions");
  const high = document.querySelector(".weather__high");
  const low = document.querySelector(".weather__low");
  const wind = document.querySelector(".weather__wind");

  const image = document.querySelector(".weather__image");

  const cityForm = document.querySelector(".city-form");
  const fahrenheit = document.querySelector(".fahrenheit");
  const celsius = document.querySelector(".celsius");

  // global variables

  let isFahrenheit = true;
  let savedObj = {};

  // functions
  function displayError() {
    message.style.display = "block";
    city.innerText = "";
    currentTemp.innerText = "";
    conditions.innerText = "";
    high.innerText = "";
    low.innerText = "";
    wind.innerText = "";
  }

  function displayImperial() {
    if (isFahrenheit === false) {
      celsius.classList.remove("button--active");
      fahrenheit.classList.add("button--active");
    }
    isFahrenheit = true;
    displayWeather(savedObj);
  }

  function displayMetric() {
    if (isFahrenheit === true) {
      fahrenheit.classList.remove("button--active");
      celsius.classList.add("button--active");
    }
    isFahrenheit = false;
    displayWeather(savedObj);
  }

  function displayWeather(obj) {
    message.style.display = "none";
    city.innerText = obj.city;
    conditions.innerText = obj.conditions;

    if (isFahrenheit === true) {
      currentTemp.innerText = obj.currentTemp + "°F";
      high.innerText = "High: " + obj.highTemp + "°F";
      low.innerText = "Low: " + obj.lowTemp + "°F";
      wind.innerText = `Wind: ${obj.windSpeed} mph, ${obj.compassDirection}`;
      return;
    }

    currentTemp.innerText = obj.calcCelsius(obj.currentTemp) + "°C";
    high.innerText = "High: " + obj.calcCelsius(obj.highTemp) + "°C";
    low.innerText = "Low: " + obj.calcCelsius(obj.lowTemp) + "°C";
    wind.innerText = `Wind: ${obj.calcWindSpeed(obj.windSpeed)} km/hr, ${
      obj.compassDirection
    }`;
  }

  function displayImg(imgData) {
    image.src = imgData.data.images.original.url;
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

  async function fetchGif(description) {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=CPclGYCuEiW2nD7terXj71m9GmdMlNND&s&s=${description}`,
        { mode: "cors" }
      );
      const imgData = await response.json();
      displayImg(imgData);
    } catch (error) {
      console.log(error);
    }
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
      savedObj = weatherObj;
      displayWeather(weatherObj);
      fetchGif(weatherObj.conditions);
    });
  }

  // Event Listeners

  cityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = cityForm.city.value;
    processData(input);
  });

  fahrenheit.addEventListener("click", displayImperial);
  celsius.addEventListener("click", displayMetric);

  // init
  processData("Detroit");
})();
