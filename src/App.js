import React, { useState, useEffect, useContext } from "react";
import { Data } from "./contexts/Data";
import { API } from "./contexts/API";
import Map from "./components/Map";
import CurrentLocation from "./components/CurrentLocation";
import Button from "./components/Button";
import State from "./components/State";

export default function App() {
    const { dataLoaded } = useContext(Data);
    const { googleAPIKeyLoaded } = useContext(API);

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
            {coords && googleAPIKeyLoaded && dataLoaded && <Map coords={coords} />}
            <CurrentLocation />

            <Button text={"Tengo Covid-19"} callback={() => {}} />
            <State />
        </div>
    );
}
