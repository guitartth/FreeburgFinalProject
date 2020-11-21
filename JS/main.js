const WEATHER_API_KEY = "33c06c3cce7ccfe0faffd41db8db83a3";

// Used to save user location locally
let userZip;

// Used to store state from zip code
let state = "";

window.onload = function() {
  localStorage.clear();
  // Load default or user saved weather
  getLocation();
  if (userZip === undefined){
    state = "NY";
    getCurrentWeather("14767");
  }
  else {
    getCurrentWeather(userZip);
  }

  // Set up event listener for search button
  document.getElementById("search").addEventListener("click", function(event) {
    event.preventDefault();
    getCurrentWeather(document.getElementById("zipCode").value);
    getState(document.getElementById("zipCode").value);
  });

  // Set up event listener for save button
  document.getElementById("save").addEventListener("click", function(event) {
    event.preventDefault();
    saveLocation(document.getElementById("zipCode").value);
  });
}

// Get current weather by zip code
async function getCurrentWeather(zip) {
  document.getElementById('status').innerText = '';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=${WEATHER_API_KEY}`);
  const weatherData = await response.json();
  if (weatherData.cod!="200"){
    document.getElementById('status').innerText = weatherData.message;
  }
  else {
    console.log("Craig");
    getState(document.getElementById("zipCode").value);
    console.log(document.getElementById("zipCode").value)
    displayWeather(weatherData);
    getFiveDayForecast(weatherData.coord.lat, weatherData.coord.lon);
  }
}

// Get weather for 5 day forecast
async function getFiveDayForecast(lat,lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${WEATHER_API_KEY}`)
  const weatherData = await response.json();
  displayFiveDays(weatherData);
}

// Display current weather
function displayWeather(weathers) {
  document.getElementById("cityState").innerText = weathers.name + ', ' + state;
  let day = getTheDay(0);
  let date = getTheDate(0);
  let month = getTheMonth(0);
  document.getElementById("dateDisplay").innerText = `${day}, ${month} ${date}`;
  document.getElementById("currentTempArea").innerHTML = Math.round(weathers.main.temp) + "&deg;";
  document.getElementById("currentTempIconArea").src = `https://openweathermap.org/img/wn/${weathers.weather[0].icon}@2x.png`;
  
  // search for 78521 for best odds!
  let woohoo = document.getElementById("woohoo");
  if(Math.round(weathers.main.temp) >= 80){
    woohoo.play();
  }
  document.getElementById("todayHighTemp").innerHTML = Math.round(weathers.main.temp_max) + "&deg;";
  document.getElementById("todayLowTemp").innerHTML = Math.round(weathers.main.temp_min) + "&deg;";
  document.getElementById("todayWind").innerText = Math.round(weathers.wind.speed) + 'mph';
  document.getElementById("todayHumidity").innerText = weathers.main.humidity + '%';
}

// Display five day forecast
function displayFiveDays(weathers) {
  let daily = weathers.daily;
  // Day 1
  let date1 = getTheDate(1);
  let day1 = getTheDay(1);
  document.getElementById("fiveDayDate1").innerText = `${day1}-${date1}`;
  document.getElementById("fiveDayHigh1").innerHTML = Math.round(daily[1].temp.max) + "&deg;";
  document.getElementById("fiveDayLow1").innerHTML = Math.round(daily[1].temp.min) + "&deg;";
  // Day 2
  let date2 = getTheDate(2);
  let day2 = getTheDay(2);
  document.getElementById("fiveDayDate2").innerText = `${day2}-${date2}`;
  document.getElementById("fiveDayHigh2").innerHTML = Math.round(daily[2].temp.max) + "&deg;";
  document.getElementById("fiveDayLow2").innerHTML = Math.round(daily[2].temp.min) + "&deg;";
  // Day 3
  let date3 = getTheDate(3);
  let day3 = getTheDay(3);
  document.getElementById("fiveDayDate3").innerText = `${day3}-${date3}`;
  document.getElementById("fiveDayHigh3").innerHTML = Math.round(daily[3].temp.max) + "&deg;";
  document.getElementById("fiveDayLow3").innerHTML = Math.round(daily[3].temp.min) + "&deg;";
  // Day 4
  let date4 = getTheDate(4);
  let day4 = getTheDay(4);
  document.getElementById("fiveDayDate4").innerText = `${day4}-${date4}`;
  document.getElementById("fiveDayHigh4").innerHTML = Math.round(daily[4].temp.max) + "&deg;";
  document.getElementById("fiveDayLow4").innerHTML = Math.round(daily[4].temp.min) + "&deg;";
  // Day 5
  let date5 = getTheDate(5);
  let day5 = getTheDay(5);
  document.getElementById("fiveDayDate5").innerText = `${day5}-${date5}`;
  document.getElementById("fiveDayHigh5").innerHTML = Math.round(daily[5].temp.max) + "&deg;";
  document.getElementById("fiveDayLow5").innerHTML = Math.round(daily[5].temp.min) + "&deg;";
}

// Sets userZip to locally saved user location
function getLocation () {
  userZip = localStorage.getItem("zipCode");
  if (userZip === null)
    userZip = 14767;
}

// Saves user location locally
function saveLocation (zip) {
  if (zip !== 14767 && zip !== undefined && zip !== null && zip !== "") {
    localStorage.setItem("zipCode", `${zip}`);
    document.getElementById('status').innerText = "Location saved successfully";
  }
  else {
    document.getElementById('status').innerText = "No location to save";
  }
}

// Returns day of the week
function getTheDay(add) {
  let date = new Date();
  let weekDay = new Array(7);
  weekDay[0] = "Sunday";
  weekDay[1] = "Monday";
  weekDay[2] = "Tuesday";
  weekDay[3] = "Wednesday";
  weekDay[4] = "Thursday";
  weekDay[5] = "Friday";
  weekDay[6] = "Saturday";
  let theDay = date.getDay();
  if( (theDay + add) > 6){
    return weekDay[date.getDay() + (add-7)];
  }
  else{
    return weekDay[date.getDay() + add];
  }
}

// Returns date of the month
function getTheDate(add) {
  let newDate = new Date();
  return (newDate.getDate() + add);
}

// Returns the month of the year
function getTheMonth(add) {
  let date = new Date();
  let month = new Array(12);
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  return month[date.getMonth() + add];
}

// Returns state abbreviation by zip code
async function getState(zip){
  if (zip === null || zip === undefined || zip === ""){
    state = "NY";
  }
  else {
    const response = await fetch(`https://www.zipcodeapi.com/rest/wdRoogzYcYJRUtCj0fRqhsJZKv5oqkIhJLGfImlVMudKMJHzv8kAemmrrbELETOE/info.json/${zip}/degrees`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const stateData = await response.json();
    console.log(stateData.state);
    state = stateData.state;
    console.log("Craig");
  }
}