// // const API_KEY = "0ff9914403129255dcec384cb93fe671";

// // export const fetchWeatherByCity = async (city: string) => {
// //   const res = await fetch(
// //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
// //   );
// //   if (!res.ok) throw new Error("City not found");
// //   return await res.json();
// // };
const API_KEY = "0ff9914403129255dcec384cb93fe671";

export const fetchWeatherByCity = async (city: string) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("City not found");
  return await res.json();
};

export const fetchAQIByCoords = async (lat: number, lon: number) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch AQI");
  const data = await res.json();
  return data.list[0].main.aqi; // AQI is 1–5 scale
};

// export const fetchUVIndexByCoords = async (lat: number, lon: number) => {
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//   );
//   if (!res.ok) throw new Error("Failed to estimate UV Index");
//   const data = await res.json();

//   const hour = new Date().getHours();
//   const cloudiness = data.clouds?.all || 0;

//   // Estimate UV based on time of day and cloudiness
//   let uv = 0;
//   if (hour >= 10 && hour <= 15) {
//     uv = 10 - cloudiness / 10;
//     if (uv < 0) uv = 0;
//   }

//   return Math.round(uv);
// }; 
// export const fetchUVIndexByCoords = async (lat: number, lon: number) => {
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//   );
//   if (!res.ok) throw new Error("Failed to fetch UV Index");
//   const data = await res.json();
//   return data.value; // UV index value
// };

export const fetchHourlyForecast = async (lat: number, lon: number) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch hourly forecast");
  const data = await res.json();
  return data.list.slice(0, 8); // 3-hour steps → next 24 hours
};

interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}
export const fetchFiveDayForecast = async (lat: number, lon: number) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast");
  
  const data = await res.json();
  
  const grouped: Record<string, WeatherData[]> = {};
  
  // Group data by date
  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  }

  // Get the first 5 days
  const days = Object.keys(grouped).slice(0, 5);

  return days.map((day) => {
    const items = grouped[day];
    
    const temps = items.map((i) => i.main.temp);
    const humidities = items.map((i) => i.main.humidity);
    const winds = items.map((i) => i.wind.speed);

    return {
      date: day,
      icon: items[0].weather[0].icon,
      description: items[0].weather[0].description,
      feels_like: Math.round(items[0].main.feels_like),
      temp_max: Math.round(Math.max(...temps)),
      temp_min: Math.round(Math.min(...temps)),
      humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      wind: Math.round(winds.reduce((a, b) => a + b, 0) / winds.length),
    };
  });
};

export const fetchUVIndexByCoords = async (lat: number, lon: number) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=uv_index&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch UV index");
  const data = await res.json();

  const currentHour = new Date().toISOString().slice(0, 13); // e.g., "2025-07-16T14"
  const uvIndexList = data?.hourly?.uv_index ?? [];
  const timeList = data?.hourly?.time ?? [];

  const index = timeList.findIndex((time: string) => time.startsWith(currentHour));
  return index !== -1 ? uvIndexList[index] : null;
};


