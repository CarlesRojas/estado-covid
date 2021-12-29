import React, { useContext, useRef, useEffect, useState } from "react";
import { Data } from "../contexts/Data";
import { GlobalState } from "../contexts/GlobalState";
import useGlobalState from "../hooks/useGlobalState";
import provincesData from "../resources/data/provinces.json";
import DateSlider from "./DateSlider";
import SVG from "react-inlinesvg";

import VirusIcon from "../resources/icons/virus.svg";
import DistancingIcon from "../resources/icons/distancing.svg";
import GatherIcon from "../resources/icons/gather.svg";
import LockdownIcon from "../resources/icons/lockdown.svg";
import MaskIcon from "../resources/icons/mask.svg";
import NightIcon from "../resources/icons/night.svg";
import QrIcon from "../resources/icons/qr.svg";

const isSpain = (location) => {
    if (!location) return false;
    if (location.address_components.length === 3 && location.address_components[2].short_name !== "ES") return false;
    if (location.address_components.length > 3 && location.address_components[3].short_name !== "ES") return false;
    return true;
};

const ICONS = {
    distancing: {
        icon: DistancingIcon,
        text: "Respete una distancia social de 2m.",
    },
    gather: {
        icon: GatherIcon,
        text: "No se reúna con más de 10 personas.",
    },
    lockdown: {
        icon: LockdownIcon,
        text: "Quédese en casa siempre que sea posible.",
    },
    mask: {
        icon: MaskIcon,
        text: "Lleve mascarilla siempre fuera de casa.",
    },
    night: {
        icon: NightIcon,
        text: "Evite cualquier actividad nocturna.",
    },
    qr: {
        icon: QrIcon,
        text: "Pasaporte Covid-19 obligatorio en interiores.",
    },
};

const ALERT_LEVELS = {
    high: {
        max: 1,
        text: "ALTO",
        icons: ["lockdown", "gather", "qr", "night", "mask", "distancing"],
    },
    medium: {
        max: 0.6,
        text: "MEDIO",
        icons: ["gather", "qr", "night", "mask", "distancing"],
    },
    low: {
        max: 0.2,
        text: "BAJO",
        icons: ["mask", "distancing"],
    },
};

const getAlertLevel = (value) => {
    if (value < ALERT_LEVELS.low.max) return "low";
    else if (value < ALERT_LEVELS.medium.max) return "medium";
    else return "high";
};

export default function CovidData({ headerHeight }) {
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

    const [data, setData] = useState(null);

    useEffect(() => {
        if (!currentLocation) return;

        const getData = () => {
            if (!("address_components" in currentLocation) || currentLocation.address_components.length < 2)
                return null;

            for (let i = 0; i < provinces.current.length; i++) {
                const element = provinces.current[i];

                if (element.google_name === currentLocation.address_components[1].long_name)
                    return covidDataProvinces.current[covidDataProvinces.current.length - 1 - date][element.id_covid];
            }
        };

        setData(getData());
    }, [date, currentLocation, covidDataProvinces]);

    // #################################################
    //   ALERT LEVEL
    // #################################################

    const riskLevel = data ? getAlertLevel(data.riskValue) : null;

    // #################################################
    //   DOM CONTENT
    // #################################################

    var domContent = (
        <div className="headerContent center">
            <SVG className="icon" src={VirusIcon} />
        </div>
    );

    if (currentLocation !== null) {
        if (isSpain(currentLocation))
            domContent = (
                <div className="headerContent">
                    <p className="subtitle">Nivel de Alerta</p>
                    <p className="alertLevel">{riskLevel in ALERT_LEVELS && ALERT_LEVELS[riskLevel].text}</p>
                    <p className="address">{currentLocation.formatted_address}</p>
                    {riskLevel in ALERT_LEVELS && (
                        <div className="icons">
                            {ALERT_LEVELS[riskLevel].icons.map((iconName, i) => (
                                <div className="recomendation" key={i}>
                                    <SVG className="recomendationIcon" src={ICONS[iconName].icon} />
                                    <p className="recomendationIconSubtitle">{ICONS[iconName].text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        else
            domContent = (
                <div className="headerContent">
                    <p className="subtitle">Nivel de Alerta</p>
                    <p className="alertLevel">Sin Datos</p>
                    <p className="address">{currentLocation ? currentLocation.formatted_address : ""}</p>
                    <p className="subtitle">Desplázate sobre España para ver el estado del virus Covid-19</p>
                </div>
            );
    }

    return (
        <div className="covidData">
            <div className="header" style={{ height: `${headerHeight}px`, maxHeight: `${headerHeight}px` }}>
                <DateSlider />
                {domContent}
            </div>
        </div>
    );
}
