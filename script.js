let citynames = [];

function citysearch() {
	let newcity = $('#searched').val();
	console.log(newcity);
	const APIKey = '4e66cbfd3be4fc40a4781f8984622983';
	const queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + newcity + '&appid=' + APIKey;

	// Here we run our AJAX call to the OpenWeatherMap API
	$.ajax({
		url    : queryURL,
		method : 'GET'
	})
		// We store all of the retrieved data inside of an object called "response"
		.then(function(response) {
			// Log the queryURL
			console.log(queryURL);
			const location = response.name;
			const tempF = (response.main.temp - 273.15) * 1.8 + 32;
			const humidity = response.main.humidity;
			const wind = response.wind.speed;
			// const uv = response.
			const icon = response.weather[0].icon;
			const weathericon = $('<img>');
			$('#location').text(location);
			$(weathericon).attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
			$('#temperature').text('Temperature: ' + Math.floor(tempF) + '°F');
			$('#location').append(weathericon);
			if (tempF < 50) {
				$('#temperature').attr('class', 'tempcold');
			}
			if (tempF > 50 && tempF < 80) {
				$('#temperature').attr('class', 'tempmid');
			}
			if (tempF > 80) {
				$('#temperature').attr('class', 'temphot');
			}
			$('#humidity').text('Humidity: ' + humidity + '%');
			$('#windspeed').text('WInd Speed: ' + wind + ' MPH');
			// Log the resulting object
			console.log(response);
		});
}
function displaynames() {
	let city = $('#searched').val();
	console.log(city);
	localStorage.setItem(city, city);
	for (var key in localStorage) {
		if (
			key === 'key' ||
			key === 'getItem' ||
			key === 'setItem' ||
			key === 'removeItem' ||
			key === 'clear' ||
			key === ''
		) {
		} else {
			let score = localStorage.getItem(key);
			let list = $('<li>');
			let btn = $('<button>');
			$(list).attr('class', 'list-group-item');
			$(btn).attr('class', 'btn btn-light btn-block text-left');
			$(btn).text(score);
			console.log(score);
			$('.citylist').append(list);
			$(list).append(btn);
		}
	}
}

$(document).ready(function() {
	displaynames();
	$('#search').on('click', function(event) {
		event.preventDefault();
		console.log('test');
		citysearch();
	});
});
