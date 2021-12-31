import React, { useContext, useRef, useEffect, useState } from "react";
import { Data } from "../contexts/Data";
import { Language } from "../contexts/Language";
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
import Graph from "./Graph";

const isSpain = (location) => {
    if (!location) return false;
    if (location.address_components.length === 3 && location.address_components[2].short_name !== "ES") return false;
    if (location.address_components.length > 3 && location.address_components[3].short_name !== "ES") return false;
    return true;
};

const ICONS = {
    distancing: {
        icon: DistancingIcon,
        textCode: "covidData_icons_distancing",
    },
    gather: {
        icon: GatherIcon,
        textCode: "covidData_icons_gather",
    },
    lockdown: {
        icon: LockdownIcon,
        textCode: "covidData_icons_lockdown",
    },
    mask: {
        icon: MaskIcon,
        textCode: "covidData_icons_mask",
    },
    night: {
        icon: NightIcon,
        textCode: "covidData_icons_night",
    },
    qr: {
        icon: QrIcon,
        textCode: "covidData_icons_qr",
    },
};

const ALERT_LEVELS = {
    high: {
        max: 1,
        textCode: "covidData_alertLevel_hight",
        icons: ["lockdown", "gather", "qr", "night", "mask", "distancing"],
    },
    medium: {
        max: 0.6,
        textCode: "covidData_alertLevel_medium",
        icons: ["gather", "qr", "night", "mask", "distancing"],
    },
    low: {
        max: 0.2,
        textCode: "covidData_alertLevel_low",
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

    const { language } = useContext(Language);
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
    const province = useRef("");

    useEffect(() => {
        if (!currentLocation) return;

        const getData = () => {
            if (!("address_components" in currentLocation) || currentLocation.address_components.length < 2)
                return null;

            for (let i = 0; i < provinces.current.length; i++) {
                const element = provinces.current[i];

                if (element.google_name === currentLocation.address_components[1].long_name) {
                    province.current = element;
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

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - date);
    currentDate = currentDate.toLocaleString(language.locale).split(" ")[0].split(",")[0];

    if (currentLocation !== null) {
        if (isSpain(currentLocation))
            domContent = (
                <>
                    <DateSlider />
                    <p className="alerta">{language.covidData_alerta}</p>
                    <p className="alertLevel">
                        {riskLevel in ALERT_LEVELS && language[ALERT_LEVELS[riskLevel].textCode]}
                    </p>
                    <p className="address">{`${currentLocation.address_components[0].long_name}, ${province.current.name}`}</p>
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
                                    <p className="recomendationIconSubtitle">{language[ICONS[iconName].textCode]}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {data && (
                        <div className="data">
                            <div className="numGraphContainer">
                                <div className="numbers">
                                    <div className="numberContainer">
                                        <div className="number">
                                            {data.today_new_confirmed.toLocaleString(language.locale)}
                                        </div>
                                        <div className="info">
                                            {!date || date === 0
                                                ? language.covidData_numbers_newCasesToday(province.current.name)
                                                : language.covidData_numbers_newCasesPast(
                                                      province.current.name,
                                                      currentDate
                                                  )}
                                        </div>
                                    </div>

                                    <div className="numberContainer">
                                        <div className="number">
                                            {data.activeCovidCases.toLocaleString(language.locale)}
                                        </div>
                                        <div className="info">
                                            {!date || date === 0
                                                ? language.covidData_numbers_casesToday(province.current.name)
                                                : language.covidData_numbers_casesPast(
                                                      province.current.name,
                                                      currentDate
                                                  )}
                                        </div>
                                    </div>

                                    <div className="numberContainer">
                                        <div className="number">{`${(data.activeCovidCasesPerCapita * 100)
                                            .toFixed(2)
                                            .toLocaleString(language.locale)}%`}</div>
                                        <div className="info">
                                            {!date || date === 0
                                                ? language.covidData_numbers_percentageToday(province.current.name)
                                                : language.covidData_numbers_percentagePast(
                                                      province.current.name,
                                                      currentDate
                                                  )}
                                        </div>
                                    </div>
                                </div>

                                <Graph
                                    provinceId={province.current.id_covid}
                                    provinceName={province.current.name}
                                    date={date}
                                />
                            </div>
                        </div>
                    )}

                    {data && "source" in data && (
                        <div className="provider">
                            {language.covidData_provider}
                            <span>{data.source}</span>
                            {language.covidData_and}
                            <a href="https://covid19tracking.narrativa.com/" rel="noreferrer" target="_blank">
                                Narrativa
                            </a>
                            .
                        </div>
                    )}
                </>
            );
        else
            domContent = (
                <>
                    <DateSlider />
                    <p className="alerta">{language.covidData_alerta}</p>
                    <p className="alertLevel">{language.covidData_noData}</p>
                    <p className="address">{currentLocation ? currentLocation.formatted_address : ""}</p>
                    <p className="subtitle">{language.covidData_moveOverSpain}</p>
                </>
            );
    }

    return <div className="covidData">{domContent}</div>;
}
