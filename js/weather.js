function getWeatherData(lang, fnOK, fnError) 
{
    navigator.geolocation.getCurrentPosition(locSuccess, locError);
    
    function locSuccess(position) 
    {
        // Check cache
        var input = localStorage.input && JSON.parse(localStorage.input);
        if (input === undefined) {input = 'Lviv';}
        var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
        var currDate = new Date();
         //If the cache is newer than 30 minutes, use the cache
        if (cache && cache.timestamp && cache.data.city.name === input && cache.timestamp > currDate.getTime() - 30 * 60 * 1000) 
        {
            fnOK.call(this, cache.data);
        } 
        else 
        {
            $.getJSON(
                      'http://api.openweathermap.org/data/2.5/forecast/daily?q=' 
                      + input + '&APPID=6f4cc0e79d6e2b4528e54c175d577947&cnt=7&units=metric' + '&lang=' + lang + '&callback=?',
                function (response) 
                {
                    // Store the cache
                    localStorage.weatherCache = JSON.stringify(
                    {
                        timestamp: (new Date()).getTime(),	// getTime() returns milliseconds
                        data: response
                    });
                    // Call the function again
                    locSuccess(position);
                }
            );
        }
    }
    function locError(error) 
    {
        var message = 'Location error. ';
        switch(error.code) 
        {
            case error.TIMEOUT:
                message += 'A timeout occured! Please try again!';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'We can\'t detect your location. Sorry!';
                break;
            case error.PERMISSION_DENIED:
                message += 'Please allow geolocation access for this to work.';
                break;
            case error.UNKNOWN_ERROR:
                message += 'An unknown error occured!';
                break;
        }
        fnError.call(this, message);
    }
}