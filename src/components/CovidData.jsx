import React, { useContext, useCallback, useRef, useState, useEffect } from "react";
import { Data } from "../contexts/Data";
import provincesData from "../resources/data/provinces.json";
import SVG from "react-inlinesvg";
import DateSlider from "./DateSlider";

import VirusIcon from "../resources/icons/virus.svg";

const isSpain = (location) => {
    if (!location) return false;

    if (location.address_components.length === 3 && location.address_components[2].short_name !== "ES") return false;

    if (location.address_components.length > 3 && location.address_components[3].short_name !== "ES") return false;

    return true;
};

export default function CovidData() {
    const { currentLocation, covidDataProvinces, date } = useContext(Data);

    // #################################################
    //   PROVINCES
    // #################################################

    const provinces = useRef(provincesData);

    // #################################################
    //   CURRENT DATA
    // #################################################

    const [data, setData] = useState(null);

    const getCovidData = useCallback(() => {
        if (
            !currentLocation ||
            !("address_components" in currentLocation) ||
            currentLocation.address_components.length < 2
        )
            return null;

        for (let i = 0; i < provinces.current.length; i++) {
            const element = provinces.current[i];

            if (element.google_name === currentLocation.address_components[1].long_name)
                return covidDataProvinces.current[covidDataProvinces.current.length - 1 - date][element.id_covid];
        }
    }, [covidDataProvinces, currentLocation, date]);

    useEffect(() => {
        setData(getCovidData());
    }, [date, currentLocation, covidDataProvinces, getCovidData]);

    console.log(data);

    // #################################################
    //   DOM CONTENT
    // #################################################

    var domContent = (
        <div className="header">
            <SVG className="icon" src={VirusIcon} />
        </div>
    );

    if (currentLocation !== null) {
        if (isSpain(currentLocation))
            domContent = (
                <div className="header">
                    <p className="address">{currentLocation.formatted_address}</p>
                    <p className="alertLevel">ALTA</p>
                    <p className="subtitle">Nivel de Alerta</p>
                </div>
            );
        else {
            domContent = (
                <div className="header">
                    <p className="address">{currentLocation ? currentLocation.formatted_address : ""}</p>
                    <p className="alertLevel">Sin Datos</p>
                    <p className="subtitle">Desplázate sobre España para ver el estado del virus Covid-19</p>
                </div>
            );
        }
    }

    return (
        <div className="covidData">
            <DateSlider ready={currentLocation && currentLocation.address_components.length >= 4} />
            {domContent}
        </div>
    );
}
