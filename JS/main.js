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
function getCurrentWeather(zip) {
  document.getElementById('div-status').innerText = '';

	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city +'&units=imperial&appid=' + WEATHER_API_KEY)  
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {
        console.log(JSON.stringify(data));
        if(data.cod!="200"){
            document.getElementById('div-status').innerText = data.message;
        }else{  
            fillWeatherCurrent(data);
            fetchWeather7Days(data.coord.lat, data.coord.lon);
        }
	})
	.catch(function(error) {
        console.log(error);
	});
}

// Get weather for 5 day forecast
function getFiveDayForecast(lat,lon) {
	fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat +'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid=' + WEATHER_API_KEY)  
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {
		fillWeather5days(data);
	})
	.catch(function() {
		// catch any errors
	});
}

// Display current weather
function fillWeatherCurrent( data ) {
    document.getElementById("h1_city_name").innerText = data.name + ','+ data.sys.country;
    var date = new Date((data.dt + data.timezone)* 1000);

    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    options.timeZone = 'UTC';
    document.getElementById("div_current_date").innerText = date.toLocaleString('en-US', options)

    document.getElementById("img_current-temperature_icon").src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    document.getElementById("div_current-temperature_value").innerHTML= Math.round(data.main.temp)+"&deg;";
    document.getElementById("div_current-temperature_summary").innerText = data.weather[0].main;
    document.getElementById("div-current-temp-high_value").innerHTML = Math.round(data.main.temp_max) +"&deg;";
    document.getElementById("div-current-temp-low_value").innerHTML = Math.round(data.main.temp_min)+"&deg;";
    document.getElementById("div-current-wind-speed_value").innerText = Math.round(data.wind.speed)+'mph';
    document.getElementById("div-current-humidity_value").innerText = data.main.humidity+'%';

    var dateSunRise = new Date((data.sys.sunrise + data.timezone)* 1000);
    var dateSunSet = new Date((data.sys.sunset + data.timezone)* 1000);
    let options2 = { hour:'2-digit', minute:'2-digit'};
    options2.timeZone = 'UTC';
    document.getElementById("div-current-sunrise_value").innerHTML = '<time>' + dateSunRise.toLocaleString('en-US', options2) + '</time>';
    document.getElementById("div-current-sunset_value").innerHTML = '<time>' +  dateSunSet.toLocaleString('en-US', options2)+ '</time>';
}

// Display five day forecast
function fillWeather5days( data ) {
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
}

// Sets userZip to locally saved user location
function getLocation () {
  userZip = localStorage.getItem(`${zip}`);
}

// Saves user location locally
function saveLocation (zip) {
  localStorage.setItem(`${zip}`);
}