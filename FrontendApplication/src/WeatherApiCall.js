export default async function getTheWeatherData(zone) {
    const url = `https://api.weatherapi.com/v1/current.json?key=99958fa96eca4489a4d102458242404&q=${zone}&aqi=no`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data["current"]["condition"]["text"];

}
