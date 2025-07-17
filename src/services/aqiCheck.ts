export function AQIdata(pm25: number): number {
  const breakpoints = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0.0, concHigh: 12.0 },
    { aqiLow: 51, aqiHigh: 100, concLow: 12.1, concHigh: 35.4 },
    { aqiLow: 101, aqiHigh: 150, concLow: 35.5, concHigh: 55.4 },
    { aqiLow: 151, aqiHigh: 200, concLow: 55.5, concHigh: 150.4 },
    { aqiLow: 201, aqiHigh: 300, concLow: 150.5, concHigh: 250.4 },
    { aqiLow: 301, aqiHigh: 400, concLow: 250.5, concHigh: 350.4 },
    { aqiLow: 401, aqiHigh: 500, concLow: 350.5, concHigh: 500.4 },
  ];

  const bp = breakpoints.find(
    (b) => pm25 >= b.concLow && pm25 <= b.concHigh
  );

  if (!bp) return -1;

  const { aqiLow, aqiHigh, concLow, concHigh } = bp;
  return Math.round(
    ((aqiHigh - aqiLow) / (concHigh - concLow)) * (pm25 - concLow) + aqiLow
  );
}
