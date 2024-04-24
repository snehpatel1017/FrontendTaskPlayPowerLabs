import { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import Slider from '@mui/material/Slider'
import getTheWeatherData from './WeatherApiCall';
import { handleExport } from './ExportLoad';


function TimeConverter({ switchToDark, switchToLight }) {

    const [timezones, setTimezone] = useState([]);
    const [utctime, setUTCtime] = useState(moment.utc());
    const [popupzones, setPopupzones] = useState([]);
    const [redolist, setRedolist] = useState([]);



    function changeUTC(e, zone) {
        let hour = Math.floor(e.target.value / 60);
        let minutes = (e.target.value - hour * 60);


        if (hour <= 18 && hour >= 8) {

            switchToLight();
        }
        else if ((hour > 18 || hour < 8)) {
            switchToDark();

        }
        const sample = moment.tz(zone["name"]).set({ hour, minutes });
        setUTCtime((utctime) => sample.utc());
    }

    function setDate(e) {
        const dateValue = e.target.value; // Get the date value from the input
        const newUtcMoment = moment.utc(dateValue); // Create UTC moment object from the date value
        setUTCtime(newUtcMoment);
    }

    const handleTimeZoneChange = async (e) => {
        let present = false;
        for (let i = 0; i < timezones.length; i++) {
            if (timezones[i] == e.target.value) {
                present = true;
                break;
            }
        }
        if (!present) {
            setPopupzones([...popupzones, timezones]);
            const weather = await getTheWeatherData(e.target.value);

            setTimezone([...timezones, { "name": e.target.value, "hour": -1, "minutes": -1, "weather": weather }]);
        }

    };

    function removeTimeZone(id) {
        const updatedList = timezones.filter((_, index) => index !== id);
        setPopupzones([...popupzones, timezones]);
        setTimezone(updatedList);
    }

    function reverseList() {

        const revers = timezones.reverse();

        setTimezone([...revers]);
    }

    function handleUndo() {
        const length = popupzones.length;
        if (length > 0) {
            const last = popupzones[length - 1];
            setRedolist([...redolist, timezones]);
            setTimezone(() => last);
            setPopupzones(() => popupzones.filter((_, index) => index !== length - 1));
        }
    }

    function handleRedo() {
        const length = redolist.length;
        if (length > 0) {
            const last = redolist[length - 1];
            setPopupzones([...popupzones, timezones]);
            setTimezone(() => last);
            setRedolist(() => redolist.filter((_, index) => index !== length - 1));

        }
    }
    const handleLoad = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const fileData = JSON.parse(e.target.result);
                if (fileData.length > 0) {
                    const zone = fileData[0];
                    const hour = zone['hour'];
                    const minutes = zone['minutes'];
                    const sample = moment.tz(zone["name"]).set({ hour, minutes });
                    setUTCtime((utctime) => sample.utc());

                }
                setTimezone(() => fileData);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        };

        reader.readAsText(file);
    };


    return (
        <div>
            <div className="w-1/2 mx-auto mt-11">
                <h3 className='font-mono antialiased text-3xl font-bold mb-3'>Timezone Converter</h3>
                <div className='flex justify-between text-black'>
                    <div>
                        <select onChange={handleTimeZoneChange} className='border text-sm rounded-lg hover:border-black block  p-2.5 '>
                            <option>Select TimeZone</option>
                            {moment.tz.names().map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex  gap-3'>
                        <div className='border text-sm rounded-lg hover:border-black  block p-2.5  dark:border-gray-600 '>
                            <input type='date' onChange={setDate} className='outline-none focus:outline-none '></input>
                        </div>
                        <div>
                            <button type="button" onClick={reverseList} className="text-black border-2 bg-white hover:border-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Reverse</button>
                        </div>
                        <div>
                            <button type="button" onClick={handleUndo} className="text-black border-2 bg-white hover:border-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Undo</button>
                        </div>
                        <div>
                            <button type="button" onClick={handleRedo} className="text-black border-2 bg-white hover:border-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Redo</button>
                        </div>
                        <div>
                            <button type="button" onClick={() => { handleExport(timezones, utctime) }} className="text-black border-2 bg-white hover:border-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">export</button>
                        </div>
                        <div>
                            <input type="file" onChange={handleLoad} placeholder='load'></input>
                        </div>


                    </div>
                </div>
                <div className='flex-col gap-3 mt-3  text-black'>
                    {
                        timezones.length == 0 ? <p className='font-mono text-gray-600 text-lg m-5'>Select the TimeZone</p> : timezones.map((zone, index) => {
                            const zoneMoment = utctime.tz(zone['name']);
                            // const weather = await getTheWeatherData(zone);

                            return (<div key={zone['name']} className='m-2'>
                                <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
                                    <div className='w-full flex justify-between'>
                                        <p className='font-mono text-gray-600 text-lg'>{zone['name']}   Weather : {zone['weather']}</p>
                                        <img width="20" height="2" src="https://img.icons8.com/ios-glyphs/30/filled-trash.png" className='hover:cursor-pointer' onClick={() => removeTimeZone(index)} alt="filled-trash" />
                                    </div>

                                    <p className='text-lg font-sans'>{zoneMoment.format('MMMM Do YYYY, h:mm:ss a')}</p>
                                    <div >
                                        <Slider defaultValue={zoneMoment.hour() * 60 + zoneMoment.minute()} value={zoneMoment.hour() * 60 + zoneMoment.minute()} onChange={(e) => changeUTC(e, zone)} min={0} max={1439} valueLabelDisplay="auto" />
                                    </div>

                                </div>
                            </div>);
                        })
                    }
                </div>
            </div>


        </div >
    );
};


export default TimeConverter


