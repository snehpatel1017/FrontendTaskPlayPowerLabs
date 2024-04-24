import getTheWeatherData from "./WeatherApiCall";
import moment from 'moment-timezone'
export async function handleExport(timezones, utctime) {
    const data = await Promise.all(timezones.map(async (zone) => {
        const zoneMoment = utctime.tz(zone['name']);
        zone['hour'] = zoneMoment.hour();
        zone['minutes'] = zoneMoment.minute();
        zone['weather'] = await getTheWeatherData(zone['name']);
        return zone;

    }));
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


