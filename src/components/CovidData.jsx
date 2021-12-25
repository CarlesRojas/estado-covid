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
        <div className="loading">
            <SVG className="icon" src={VirusIcon} />
        </div>
    );

    return <div className="covidData">{data}</div>;
}
