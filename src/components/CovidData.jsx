import React, { useContext } from "react";
import { Data } from "../contexts/Data";
import SVG from "react-inlinesvg";

import VirusIcon from "../resources/icons/virus.svg";

export default function CovidData() {
    const { currentLocation } = useContext(Data);

    // #################################################
    //   CRRENT DATA
    // #################################################

    var data = (
        <div className="header">
            <SVG className="icon" src={VirusIcon} />
        </div>
    );

    if (currentLocation && currentLocation.address_components.length >= 4) {
        if (currentLocation.address_components[3].short_name !== "ES")
            data = (
                <div className="header">
                    <p className="address">{currentLocation.formatted_address}</p>
                    <p className="alertLevel">Sin Datos</p>
                    <p className="subtitle">Desplázate sobre España para ver el estado del virus Covid-19</p>
                </div>
            );
        else {
            data = (
                <div className="header">
                    <p className="address">{currentLocation.formatted_address}</p>
                    <p className="alertLevel">ALTA</p>
                    <p className="subtitle">Nivel de Alerta</p>
                </div>
            );
        }
    }

    return <div className="covidData">{data}</div>;
}
