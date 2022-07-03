import React, {useEffect, useState} from 'react';

const GetWeather = (props) => {
    const [backendData, setBackendData] = useState([{}])

    useEffect(() => {
        fetch("/api").then(response => response.json()).then(data => {
            console.log(data);
            setBackendData(data);
        })
    }, [])

    return (
        <div>
            {(typeof backendData.city === 'undefined') ?
                (
                    <p>Loading...</p>
                ) : (
                    Object.entries(backendData).map(([key, value]) => (
                            <p key={key}>{value}</p>
                        )
                    ))
            }
        </div>
    );
};

export default GetWeather;
