function fetchWeather(city) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=2cb1f67211afcc04ab3cde6076c7190a`
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
    .then(function (response) {
      return response;
    })
    .catch(function (err) {});
}

const weatherJSON = fetchWeather("Detroit");
