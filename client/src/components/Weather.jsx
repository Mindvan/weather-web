import React, {useState} from 'react';
import GetWeather from "./GetWeather";

const Weather = () => {
    const [city, setCity] = useState(
        {
            city:'',
        }
    )

    const [title, setTitle] = useState('');

    async function postCity(e) {
        e.preventDefault()
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({city})
        }
        const resp = await fetch('http://localhost:5000/post_city', request);
        console.log(resp);

        let respData = await resp.json();
        console.log(respData);
    }

    function sendCity(e) {
        e.preventDefault();
        let value = title;

        if (value !== '')
        {
            if (value.includes(' '))
            {
                value = value.replaceAll(" ", "-");
                //setForm({...form, city: value});
            }

            setTitle('');
            setCity(value);
            console.log(value);
            postCity(e);
        } else {
            alert('add values');
        }
    }

    return (
        <div>
            <form className="weather-search">
                <input className="weather-input"
                       value={title}
                       type='text'
                       name='city'
                       // Target - это dom-элемент, а value - значение внутри него
                       onChange = {e => setTitle(e.target.value)}
                       placeholder='Set your location here'/>
                <button className='weather-button' onClick={e => sendCity(e)} >
                    Нажми на меня
                </button>
            </form>

            {
                (city.city !== '') ?
                    <div>
                        твой город - {city}
                        {<GetWeather data={city}/>}
                    </div> :
                    null
            }
        </div>
    );
};

export default Weather;
