// src/services/weatherService.ts
const API_KEY = "18ccf23463d3797b6f4a3fc48058c96e";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherService = {
  getWeatherByCity: async (city: string) => {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    return {
      name: data.name,
      coord: data.coord,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      visibility: data.visibility / 1000,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  },
};
