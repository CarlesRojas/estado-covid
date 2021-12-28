import React, { useContext, useRef, useEffect } from "react";
import { Data } from "../contexts/Data";
import { GlobalState } from "../contexts/GlobalState";
import useGlobalState from "../hooks/useGlobalState";
import provincesData from "../resources/data/provinces.json";
import DateSlider from "./DateSlider";
import SVG from "react-inlinesvg";

import VirusIcon from "../resources/icons/virus.svg";

const isSpain = (location) => {
    if (!location) return false;
    if (location.address_components.length === 3 && location.address_components[2].short_name !== "ES") return false;
    if (location.address_components.length > 3 && location.address_components[3].short_name !== "ES") return false;
    return true;
};

export default function CovidData() {
    // console.log("Render CovidData");

    const { covidDataProvinces } = useContext(Data);
    const { STATE } = useContext(GlobalState);
    const [date] = useGlobalState(STATE.date);
    const [currentLocation] = useGlobalState(STATE.currentLocation);

    // #################################################
    //   PROVINCES
    // #################################################

    const provinces = useRef(provincesData);

    // #################################################
    //   CURRENT DATA
    // #################################################

    // const [data, setData] = useState(null);
    const data = useRef(null);
    const lastUsedDate = useRef();

    useEffect(() => {
        if (!currentLocation || lastUsedDate.current === date) return;
        lastUsedDate.current = date;

        const getData = () => {
            if (!("address_components" in currentLocation) || currentLocation.address_components.length < 2)
                return null;

            for (let i = 0; i < provinces.current.length; i++) {
                const element = provinces.current[i];

                if (element.google_name === currentLocation.address_components[1].long_name)
                    return covidDataProvinces.current[covidDataProvinces.current.length - 1 - date][element.id_covid];
            }
        };

        data.current = getData();
    }, [date, currentLocation, covidDataProvinces]);

    // console.log(data);

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
            <DateSlider />
            {domContent}
        </div>
    );
}
