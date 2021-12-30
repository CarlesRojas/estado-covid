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
    const lastProvince = useRef("");

    useEffect(() => {
        if (!currentLocation) return;

        const getData = () => {
            if (!("address_components" in currentLocation) || currentLocation.address_components.length < 2)
                return null;

            for (let i = 0; i < provinces.current.length; i++) {
                const element = provinces.current[i];

                if (element.google_name === currentLocation.address_components[1].long_name) {
                    lastProvince.current = element;
                    return covidDataProvinces.current[covidDataProvinces.current.length - 1 - date][element.id_covid];
                }
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
        <div className="header center" style={{ height: `${headerHeight}px`, maxHeight: `${headerHeight}px` }}>
            <SVG className="icon" src={VirusIcon} />
        </div>
    );

    // console.log("");
    console.log(data);
    // console.log(lastProvince.current);
    // console.log(currentLocation);
    console.log(date);
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - date);
    currentDate = currentDate.toLocaleString("es-ES").split(" ")[0];

    if (currentLocation !== null) {
        if (isSpain(currentLocation))
            domContent = (
                <>
                    <DateSlider />
                    <p className="alerta">Nivel de Alerta</p>
                    <p className="alertLevel">{riskLevel in ALERT_LEVELS && ALERT_LEVELS[riskLevel].text}</p>
                    <p className="address">{`${currentLocation.address_components[0].long_name}, ${lastProvince.current.name}`}</p>
                    {riskLevel in ALERT_LEVELS && (
                        <div
                            className="icons"
                            style={{
                                gridTemplateColumns: `1fr 1fr ${riskLevel !== "low" ? "1fr" : ""}`,
                                width: riskLevel !== "low" ? "100%" : "66%",
                            }}
                        >
                            {ALERT_LEVELS[riskLevel].icons.map((iconName, i) => (
                                <div className="recomendation" key={i}>
                                    <SVG className="recomendationIcon" src={ICONS[iconName].icon} />
                                    <p className="recomendationIconSubtitle">{ICONS[iconName].text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {data && (
                        <div className="data">
                            <div className="numGraphContainer">
                                <div className="numbers">
                                    <div className="numberContainer">
                                        <div className="number">{data.today_new_confirmed.toLocaleString("es-ES")}</div>
                                        <div className="info">
                                            {date === 0
                                                ? `nuevos casos de Covid-19 en ${lastProvince.current.name} hoy`
                                                : `nuevos casos de Covid-19 en ${lastProvince.current.name} el día ${currentDate}`}
                                        </div>
                                    </div>
                                    <div className="numberContainer">
                                        <div className="number">{data.activeCovidCases.toLocaleString("es-ES")}</div>
                                        <div className="info">
                                            {date === 0
                                                ? `personas tienen Covid-19 en ${lastProvince.current.name} hoy`
                                                : `personas tenían Covid-19 en ${lastProvince.current.name} el día ${currentDate}`}
                                        </div>
                                    </div>
                                    <div className="numberContainer">
                                        <div className="number">{`${(data.activeCovidCasesPerCapita * 100)
                                            .toFixed(2)
                                            .toLocaleString("es-ES")}%`}</div>
                                        <div className="info">
                                            {date === 0
                                                ? `de la población de ${lastProvince.current.name} tiene Covid-19 hoy`
                                                : `de la población de ${lastProvince.current.name} tenían Covid-19 el día ${currentDate}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="graph"></div>
                            </div>

                            {"source" in data && (
                                <div className="provider">
                                    Datos proporcionados por <span>{data.source}</span> y{" "}
                                    <a href="https://covid19tracking.narrativa.com/" rel="noreferrer" target="_blank">
                                        Narrativa
                                    </a>
                                    .
                                </div>
                            )}
                        </div>
                    )}
                </>
            );
        else
            domContent = (
                <>
                    <DateSlider />
                    <p className="alerta">Nivel de Alerta</p>
                    <p className="alertLevel">Sin Datos</p>
                    <p className="address">{currentLocation ? currentLocation.formatted_address : ""}</p>
                    <p className="subtitle">Desplázate sobre España para ver el estado del virus Covid-19</p>
                </>
            );
    }

    return <div className="covidData">{domContent}</div>;
}
