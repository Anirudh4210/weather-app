const apiKey = 'c43399b4d913f79ab1cbe91f2a8d0b4b';
const defaultCity = 'Delhi';
const weatherChartCanvas = document.getElementById('weather-chart').getContext('2d');

let weatherChart;

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value || defaultCity;
    getWeatherData(city);
});

function getWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(apiURL)
        .then(response => response.json())
        .then(data => updateCurrentWeather(data))
        .catch(error => console.error('Error fetching current weather:', error));

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => updateWeatherChart(data))
        .catch(error => console.error('Error fetching weather forecast:', error));
}

function updateCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date-time').textContent = new Date().toLocaleString();
    document.getElementById('weather-condition').textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
}

function updateWeatherChart(data) {
    const labels = data.list.map(item => new Date(item.dt_txt).toLocaleDateString());
    const temps = data.list.map(item => item.main.temp);
    const humidity = data.list.map(item => item.main.humidity);

    if (weatherChart) weatherChart.destroy();

    weatherChart = new Chart(weatherChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: humidity,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true
                }
            }
        }
    });
}
getWeatherData(defaultCity);