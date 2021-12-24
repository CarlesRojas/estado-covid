import React, { useState, useEffect, useContext } from "react";
import { Data } from "./contexts/Data";
import Map from "./components/Map";
import CurrentLocation from "./components/CurrentLocation";

export default function App() {
    const { dataLoaded } = useContext(Data);

    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            if (navigator.geolocation)
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    const { latitude, longitude } = coords;
                    setCoords({ lat: latitude, lng: longitude });
                });
        };

        getLocation();
    }, []);

    return (
        <div className="app">
            {coords && dataLoaded && <Map coords={coords} />}
            <CurrentLocation />
        </div>
    );
}
