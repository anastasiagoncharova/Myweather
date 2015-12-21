$(function () 
{
    var locale = 'en',
        weatherDiv = $('#weather'),
        scroller = $('#scroller'),
        location = $('.location');
        
    $('#btnGetWeather').click(function () 
    {
        var inputFromField = $('#inputCityName').val();
        localStorage.input = JSON.stringify(inputFromField);
        getWeatherData(locale, dataReceived, showError);
    });
    $('#inputCityName').keypress(function (e) 
    {
        var ENTER_KEY_CODE = 13;
        if (e.which === ENTER_KEY_CODE) 
        {
            $('#btnGetWeather').trigger('click');
            return false;
        }
    });
    getWeatherData(locale, dataReceived, showError);
    var icons = new Array();

    function dataReceived(data) 
    {
        // Get the offset from UTC (turn the offset minutes into ms)
        var offset = (new Date()).getTimezoneOffset() * 60 * 1000;
        var city = data.city.name;
        var country = data.city.country;
        var temperature = Math.round(data.list[0].temp.day);

        $("#temp tr:not(:first)").remove();

        $.each(data.list, function () 
        {
            // Get the local time of this forecast (the api returns it in utc)
            var localTime = new Date(this.dt * 1000 - offset);
            var timeIndex = moment(localTime).calendar().length-10;
            var timeMoment = moment(localTime).calendar().substring(0,timeIndex);
            var description = this.weather[0].description;
            var iconName = this.weather[0].icon + '.png';
            icons.push(iconName);
            addWeather(
                timeMoment, // We are using the moment.js library to format the date
                description,
                parseInt(this.temp.day),
                this.weather[0].icon
            );
            addWeatherTable
            (
                timeMoment,
                this.weather[0].icon,
                this.pressure,
                this.speed,
                description,
                Math.round(this.temp.day) + '&deg;C'
            );
        });

        $('#loc').html(city + ', <b>' + country + '</b>'); 
        // Add the location to the page
        location.html(city + ', <b>' + country + '</b>' + ' </br><b>' + temperature + '°C' + '</b>');
        weatherDiv.addClass('loaded');
        // Set the slider to the first slide
        showSlide(0);
    }
    function showDetails() 
    {
        if ($('#temp').css('display') === 'none') 
        {
            $('#temp').css("display", "table");
            $('#optionLabel').text('Click here to hide details...');
        } else 
        {
            $('#temp').css("display", "none");
            $('#optionLabel').text('Click here to see details...');
        }
    }
    $('#details').on('click', showDetails);
    
    function addWeather(day, condition, temperature, icon) 
    {
	    var markup = '<li>' +'<span id="'+icon+'" style="display:none"></span>'+
	        ' <p class="day">' + day + '</p> <p class="cond">' + condition +
	        '</p></br></br><p class="cond">' + temperature +
	        '°C</p>' + '</li>';
		scroller.append(markup);
    }
    function addWeatherTable(day, icon, pressure, speed, description, tempp) 
    {
        var markup = '<tr>' +
            '<td>' + day + '</td>' +
            '<td><img src="..images/icons/'+ icon +'.svg" style="width: 40px;"/></td>'+
            '<td>' + pressure + '</td>' +
            '<td>' + speed + '</td>' +
            '<td>' + description + '</td>' +
            '<td>' + tempp + '</td>'
            + '</tr>';
        temp.insertRow(-1).innerHTML = markup; // Додаємо рядок до таблиці
    }
	/* Handling the previous / next arrows */
	var currentSlide = 0;
	weatherDiv.find('a.previous').click(function(e)
	{
		e.preventDefault();
		showSlide(currentSlide-1);
	});

	weatherDiv.find('a.next').click(function(e)
	{
		e.preventDefault();
		showSlide(currentSlide+1);
	});
	// listen for arrow keys
	$(document).keydown(function(e)
	{
		switch(e.keyCode)
		{
			case 37: 
				weatherDiv.find('a.previous').click();
			break;
			case 39:
				weatherDiv.find('a.next').click();
			break;
		}
	});
	function showSlide(i) 
	{
	    var items = scroller.find('li');
	    var iconId = items[i].firstElementChild.id;
	    var imageUrl;
	    switch (iconId) 
	    {
	    case "01d":
	    case "01n":
	    {
	        imageUrl = "url('..images/goodweather.gif') no-repeat";
            break;
	    }
        case "02d":
        case "02n":
        {
            imageUrl = "url('..images/clouds.gif') no-repeat";
            break;
        }
        case "03d":
        case "03n":
        {
            imageUrl = "url('..images/bigcloud.gif') no-repeat";
            break;
        }
        case "04d":
        case "04n":
        {
            imageUrl = "url('..images/brokenclouds.gif') no-repeat";
            break;
        }
        case "09d":
        case "09n":
        {
            imageUrl = "url('..images/lightrain.gif') no-repeat";
            break;
        }
        case "10d":
        case "10n":
        {
            imageUrl = "url('..images/rain.gif') no-repeat";
            break;
        }
        case "11d":
        case "11n":
        {
            imageUrl = "url('..images/lightning.gif') no-repeat";
            break;
        }
        case "13d":
        case "13n":
        {
            imageUrl = "url('..images/snow.gif') no-repeat";
            break;
        }
        case "50d":
        case "50n":
        {
            imageUrl = "url('..images/mist.gif') no-repeat";
            break;
        }
	    default:
	        imageUrl = "url('..images/summer.gif') no-repeat";
            break;
	    }

	    if (i >= items.length || i < 0 || scroller.is(':animated'))
	    {
			return false;
		}
		weatherDiv.removeClass('first last');
		$('.loaded').css("background", imageUrl);

		if(i === 0)
		{
		    weatherDiv.addClass('first');
		}
		else if (i == items.length-1)
		{
			weatherDiv.addClass('last');
		}

		scroller.animate({left:(-i*100)+'%'}, function()
		{
			currentSlide = i;
		});
	}
	/* Error handling functions */
	function showError(msg)
	{
		weatherDiv.addClass('error').html(msg);
	}
});