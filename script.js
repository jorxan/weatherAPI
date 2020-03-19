const APIKey = '4e66cbfd3be4fc40a4781f8984622983';
function citysearch(data) {
	const queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + data + '&appid=' + APIKey;
	function getUVIndex(lat, lon) {
		$.ajax({
			type     : 'GET',
			url      :
				'http://api.openweathermap.org/data/2.5/uvi/forecast?appid=' + APIKey + '&lat=' + lat + '&lon=' + lon,
			dataType : 'json',
			success  : function(data) {
				const uv = $('<p>').text('UV Index: ');
				const btn = $('<span>').addClass('btn btn-sm').text(data[0].value);
				console.log(data);
				// change color depending on uv value
				if (data.value < 3) {
					btn.addClass('btn-success');
				} else if (data.value < 7) {
					btn.addClass('btn-warning');
				} else {
					btn.addClass('btn-danger');
				}

				$('#uv').append(uv.append(btn));
			}
		});
	}

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
			console.log();
			getUVIndex(response.coord.lat, response.coord.lon);
		});
}
function getForecast(searchValue) {
	$.ajax({
		type     : 'GET',
		url      : 'http://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=' + APIKey,
		dataType : 'json',
		success  : function(data) {
			// overwrite any existing content with title and empty row
			$('#forecast').html('<h4 class="mt-3">5-Day Forecast:</h4>').append('<div class="row">');

			// loop over all forecasts (by 3-hour increments)
			for (let i = 0; i < data.list.length; i++) {
				// only look at forecasts around 3:00pm
				if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
					// create html elements for a bootstrap card
					const col = $('<div>').addClass('fiveday');
					const card = $('<div>').addClass('card bg-primary text-white');
					const body = $('<div>').addClass('card-body p-2');

					const title = $('<h5>')
						.addClass('card-title')
						.text(new Date(data.list[i].dt_txt).toLocaleDateString());

					const img = $('<img>').attr(
						'src',
						'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png'
					);

					const p1 = $('<p>')
						.addClass('card-text')
						.text('Temp: ' + Math.floor(data.list[i].main.temp_max) + ' °F');
					const p2 = $('<p>').addClass('card-text').text('Humidity: ' + data.list[i].main.humidity + '%');

					// merge together and put on page
					col.append(card.append(body.append(title, img, p1, p2)));
					$('.five').append(col);
				}
			}
		}
	});
}

$(document).ready(function() {
	$('.main').hide();

	function keys() {
		for (var key in localStorage) {
			if (
				key === 'key' ||
				key === 'getItem' ||
				key === 'setItem' ||
				key === 'removeItem' ||
				key === 'clear' ||
				key === '' ||
				key === 'length'
			) {
			} else {
				let list = $('<li>');
				let btn = $('<button>');
				$(list).attr('class', 'list-group-item history');
				$(btn).attr('class', 'btn btn-light btn-block text-left');
				$(btn).text(key);
				$(list).append(btn);
				$('#cities').append(list);
			}
		}
	}
	keys();
	function append(data) {
		let list = $('<li>');
		let btn = $('<button>');
		$(list).attr('class', 'list-group-item history');
		$(btn).attr('class', 'btn btn-light btn-block text-left');
		$(btn).text(data);
		$(list).append(btn);
		$('#cities').append(list);
	}
	$('#search').on('click', function(event) {
		event.preventDefault();
		$('.main').show();
		let city = $('#searched').val();
		localStorage.setItem(city, city);
		citysearch(city);
		getForecast(city);
		append(city);
		$('.five').empty();
	});
	$('.history').on('click', function(event) {
		$('.main').show();
		event.preventDefault();
		citysearch($(this).text());
		getForecast($(this).text());
		$('.five').empty();
	});
});
