class WeatherData {
  constructor(
    currentTemp,
    highTemp,
    lowTemp,
    conditions,
    windSpeed,
    windDirection,
    sunrise,
    sunset
  ) {
    this.currentTemp = currentTemp;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
    this.conditions = conditions;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
  }

  // methods to fahrenheit conversion
  // compass direction for wind
  // sunset and sunrise methods
}

const app = (() => {
  function fetchWeather(city) {
    return (
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=2cb1f67211afcc04ab3cde6076c7190a&units=metric`
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Network error");
          }
          return response;
        })
        .then(function (response) {
          return response.json();
        })
        /*     .then(function (response) {
      return response;
    }) */
        .catch(function (err) {
          console.log(err);
        })
    );
  }

  function makeWeatherObject(data) {
    console.log(data);
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

  const weatherJSON = fetchWeather("Detroit");
  weatherJSON.then((data) => {
    const weatherObj = makeWeatherObject(data);
    console.log(weatherObj);
  });
})();
