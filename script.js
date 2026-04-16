const iconMap = {
    '01d': '01d.png', '01n': '01d.png',
    '02d': '02d.png', '02n': '02d.png',
    '03d': '03d.png', '03n': '03d.png',
    '04d': '04d.png', '04n': '04d.png',
    '09d': '09d.png', '09n': '09d.png',
    '10d': '10d.png', '10n': '10d.png',
    '11d': '11d.png', '11n': '11d.png',
    '13d': '13d.png', '13n': '13d.png',
    '50d': '50d.png', '50n': '50d.png'
};

const getIconUrl = (iconCode) => `resources/${iconMap[iconCode] || '01d.png'}`;
const toFahrenheit = (c) => (c * 9 / 5) + 32;
const formatHour = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const getDayName = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const WeatherApp = () => {
    const [current, setCurrent] = React.useState(null);
    const [hourly, setHourly] = React.useState([]);
    const [daily, setDaily] = React.useState([]);
    const [largeCities, setLargeCities] = React.useState([]);
    const [unit, setUnit] = React.useState('C');
    const [search, setSearch] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [selectedCity, setSelectedCity] = React.useState('Bekasi');

    // Fungsi untuk menghitung persentase lebar fill slider berdasarkan range suhu
    const getRangePercent = (minTemp, maxTemp) => {
        const range = maxTemp - minTemp;
        const maxPossibleRange = 30; // batas maksimum selisih suhu dalam satu hari
        let percent = (range / maxPossibleRange) * 100;
        return Math.min(100, Math.max(0, percent));
    };

    const fetchCityWeather = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const geoRes = await axios.get(`/api/geo?q=${city}`);
            if (!geoRes.data.length) throw new Error('City not found');
            const { lat, lon, name, country } = geoRes.data[0];

            const weatherRes = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
            const forecastRes = await axios.get(`/api/forecast?lat=${lat}&lon=${lon}`);

            const currentData = {
                name, country,
                temp: weatherRes.data.main.temp,
                feels_like: weatherRes.data.main.feels_like,
                temp_min: weatherRes.data.main.temp_min,
                temp_max: weatherRes.data.main.temp_max,
                wind: weatherRes.data.wind.speed,
                weather: weatherRes.data.weather[0],
                dt: weatherRes.data.dt,
                timezone: weatherRes.data.timezone
            };
            setCurrent(currentData);

            // Hourly next 8 intervals (24 jam)
            const hourlyList = forecastRes.data.list.slice(0, 8).map(item => ({
                dt: item.dt,
                temp: item.main.temp,
                weather: item.weather[0]
            }));
            setHourly(hourlyList);

            // Daily unique 5 hari
            const dailyMap = new Map();
            forecastRes.data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toISOString().split('T')[0];
                if (!dailyMap.has(date)) {
                    dailyMap.set(date, { temps: [], weathers: [], dt: item.dt });
                }
                const d = dailyMap.get(date);
                d.temps.push(item.main.temp);
                d.weathers.push(item.weather[0]);
            });
            const dailyArray = Array.from(dailyMap.values()).slice(0, 5);
            const dailyData = dailyArray.map(day => ({
                dt: day.dt,
                temp_min: Math.min(...day.temps),
                temp_max: Math.max(...day.temps),
                weather: day.weathers.reduce((a, b) => (a.id === b.id ? a : b), day.weathers[0])
            }));
            setDaily(dailyData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLargeCities = async () => {
        const cities = ['New York', 'Bandung', 'Tokyo'];
        const results = [];
        for (const city of cities) {
            try {
                const geo = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
                if (geo.data.length) {
                    const { lat, lon, name, country } = geo.data[0];
                    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
                    results.push({
                        name, country,
                        temp: weather.data.main.temp,
                        weather: weather.data.weather[0]
                    });
                }
            } catch (e) { console.error(city, e); }
        }
        setLargeCities(results);
    };

    React.useEffect(() => {
        fetchCityWeather(selectedCity);
        fetchLargeCities();
    }, [selectedCity]);

    const handleSearch = () => {
        if (search.trim()) setSelectedCity(search.trim());
        setSearch('');
    };

    const formatTemp = (c) => unit === 'F' ? Math.round(toFahrenheit(c)) : Math.round(c);

    if (loading && !current) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="weather-app">
            {/* Baris atas: search dan unit toggle */}
            <div className="top-row">
                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Search city..." value={search} onChange={e => setSearch(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} />
                    <button className="search-btn" onClick={handleSearch}><img src="resources/Search.svg" className="search-icon" alt="search" /></button>
                </div>
                <div className="unit-toggle">
                    <button className={`unit-btn ${unit === 'C' ? 'active' : ''}`} onClick={() => setUnit('C')}>°C</button>
                    <button className={`unit-btn ${unit === 'F' ? 'active' : ''}`} onClick={() => setUnit('F')}>°F</button>
                </div>
            </div>

            {/* Kolom kiri: Current Weather + Other Large Cities */}
            <div className="left-column">
                <div className="card">
                    {current && (
                        <div className="current-weather">
                            <div className="current-left">
                                <div className="temp-big">{formatTemp(current.temp)}°{unit}</div>
                                <div className="weather-group">
                                    <img src={getIconUrl(current.weather.icon)} className="weather-icon-large" alt="icon" />
                                    <div className="weather-status">{current.weather.main}</div>
                                </div>
                                <div className="feels-like">Feel like: {formatTemp(current.feels_like)}°{unit}</div>
                            </div>

                            <div className="current-right">
                                <div className="city-name">{current.name}, {current.country}</div>
                                <div className="local-time">{formatHour(current.dt, current.timezone)}</div>
                                <div className="detail-item">
                                    <img src="resources/wind.png" className="detail-icon" alt="wind" />
                                    <span>{current.wind} m/s</span>
                                </div>
                                <div className="temp-range">↑{formatTemp(current.temp_max)}°{unit} ↓{formatTemp(current.temp_min)}°{unit}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3>Other Large Cities</h3>
                    <div className="city-list">
                        {largeCities.map((city, idx) => (
                            <div key={idx} className="city-item" onClick={() => setSelectedCity(city.name)}>
                                {/* Kiri: country -> name -> status */}
                                <div className="city-left-details">
                                    <div className="city-country">{city.country}</div>
                                    <div className="city-name-sm">{city.name}</div>
                                    <div className="city-status">{city.weather.main}</div>
                                </div>
                                {/* Kanan: icon di atas temp */}
                                <div className="city-right-details">
                                    <img src={getIconUrl(city.weather.icon)} className="city-icon-sm" alt="icon" />
                                    <div className="city-temp-lg">{formatTemp(city.temp)}°{unit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Kolom kanan: Hourly Forecast + 5-day Forecast dengan slider range */}
            <div className="right-column">
                <div className="card">
                    <div className="hourly-container">
                        {hourly.map((h, idx) => (
                            <div key={idx} className="hourly-item">
                                <div className="hourly-time">{formatHour(h.dt)}</div>
                                <hr className="hourly-divider" />
                                <img src={getIconUrl(h.weather.icon)} className="hourly-icon" alt="icon" />
                                <div className="hourly-status">{h.weather.main}</div>
                                <div className="hourly-temp">{formatTemp(h.temp)}°{unit}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>5-day forecast</h3>
                    <div className="forecast-list">
                        {daily.map((day, idx) => (
                            <div key={idx} className="forecast-day-item">
                                <div className="forecast-day-name">{idx === 0 ? 'Today' : getDayName(day.dt)}</div>
                                <div className="forecast-weather-info">
                                    <img src={getIconUrl(day.weather.icon)} className="forecast-icon-sm" alt="icon" />
                                    <span>{day.weather.main}</span>
                                </div>
                                {/* Slider range suhu */}
                                <div className="temp-range-slider">
                                    <span className="temp-min">{formatTemp(day.temp_min)}°</span>
                                    <div className="range-track">
                                        <div className="range-fill" style={{ width: `${getRangePercent(day.temp_min, day.temp_max)}%` }}></div>
                                    </div>
                                    <span className="temp-max">{formatTemp(day.temp_max)}°</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<WeatherApp />);