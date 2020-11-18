import {WEATHER_API_KEY} from './apikey.js';

// Used to save user location locally
let userZip;

window.onload = function() {
  // Load default or user saved weather
  if (userZip === undefined){
    getCurrentWeather(14767);
  }
  else {
    getCurrentWeather(userZip);
  }

  // Set up event listener for search button
  document.getElementById("search").addEventListener("click", function() {
    getCurrentWeather(document.getElementById("zipCode").value);
  });

  // Set up event listener for save button
  document.getElementById("save").addEventListener("click", function() {
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
    displayWeather(weatherData);
    getFiveDayForecast(weatherData.coord.lat, weatherData.coord.lon);
  }
}

// Get weather for 5 day forecast
async function getFiveDayForecast(lat,lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${WEATHER_API_KEY}`)
  const weatherData = await response.json();
  displayFiveDays(weatherData);
}

// Display current weather
function displayWeather(weathers) {
  document.getElementById("cityState").innerText = weathers.name + ', ' + weathers.sys.country;
  let day = getTheDay();
  let date = getTheDate();
  let month = getTheMonth();
  document.getElementById("dateDisplay").innerText = `${day}, ${month} ${date}`;
  document.getElementById("currentTempIconArea").src = `http://openweathermap.org/img/wn/${weathers.weather[0].icon}@2x.png`;
  document.getElementById("currentTempArea").innerHTML = Math.round(weathers.main.temp) + "&deg;";
  document.getElementById("todayHighTemp").innerHTML = Math.round(weathers.main.temp_max) + "&deg;";
  document.getElementById("todayLowTemp").innerHTML = Math.round(weathers.main.temp_min) + "&deg;";
  document.getElementById("todayWind").innerText = Math.round(weathers.wind.speed) + 'mph';
  document.getElementById("todayHumidity").innerText = weathers.main.humidity + '%';
}

// Display five day forecast
function displayFiveDays(weather) {
  //console.log(weather)
  /*
  var next5DaysHtml="";
  const dailyData = data.daily;

  let weekOpt = { weekday: 'short'};
  weekOpt.timeZone = 'UTC'; 

  let timeOffset = data.timezone_offset;
  let monthDayOpt = {month: 'short', day: 'numeric' };
  monthDayOpt.timeZone = 'UTC';

  for(var i = 1; i < dailyData.length && i<6; i++){
    let dailyDetails = dailyData[i];
    let dailyDate = new Date((dailyDetails.dt + timeOffset)* 1000);
    
    next5DaysHtml = next5DaysHtml + '<div class="next-5-days_row"> \
    <div class="next-5-days_date"> \
    ' + dailyDate.toLocaleString('en-US', weekOpt) + 
    '<div class="next-5-days_label">' + dailyDate.toLocaleString('en-US', monthDayOpt) + '</div> \
    </div> \
    <div class="next-5-days_low">'+ Math.round(dailyDetails.temp.min) +"&deg;" +
    '<div class="next-5-days_label">Low</div> \
    </div> \
    <div class="next-5-days_high">' + Math.round(dailyDetails.temp.max) +"&deg;" +
    '<div class="next-5-days_label">High</div> \
    </div> \
    <div class="next-5-days_icon"> \
      <img src="http://openweathermap.org/img/wn/' + dailyDetails.weather[0].icon + '@2x.png" alt=""> \
    </div> \
    <div class="next-5-days_humidity">' + dailyDetails.humidity +'%' +
    '<div class="next-5-days_label">Humidity</div> \
    </div> \
    <div class="next-5-days_wind">' + Math.round(dailyDetails.wind_speed)+'mph' +
    '<div class="next-5-days_label">Wind</div> \
    </div> \
    </div>';
  }
  var next5DaysDiv = document.getElementById("div-next-5-days_container");
  next5DaysDiv.innerHTML = next5DaysHtml;
  */
}

// Sets userZip to locally saved user location
function getLocation () {
  userZip = localStorage.getItem(`${zip}`);
}

// Saves user location locally
function saveLocation (zip) {
  localStorage.setItem(`${zip}`);
}

// Returns day of the week
function getTheDay() {
  let date = new Date();
  let weekDay = new Array(7);
  weekDay[0] = "Sunday";
  weekDay[1] = "Monday";
  weekDay[2] = "Tuesday";
  weekDay[3] = "Wednesday";
  weekDay[4] = "Thursday";
  weekDay[5] = "Friday";
  weekDay[6] = "Saturday";
  return weekDay[date.getDay()];
}

// Returns date of the month
function getTheDate() {
  let newDate = new Date();
  return newDate.getDate();
}

// Returns the month of the year
function getTheMonth() {
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
  return month[date.getMonth()];
}