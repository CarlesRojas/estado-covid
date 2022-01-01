import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import Map from "./Map";
import CurrentLocation from "./CurrentLocation";
import Button from "./Button";
import Tab from "./Tab";
import Popup from "./Popup";
import { Language } from "../contexts/Language";
import { API } from "../contexts/API";
import { Utils } from "../contexts/Utils";
import { GlobalState } from "../contexts/GlobalState";
import useGlobalState from "../hooks/useGlobalState";

import InfoIcon from "../resources/icons/info.svg";
import VaccineIcon from "../resources/icons/vaccine.svg";

const getVaccineText = (language, numOfVaccines) => {
    var number = language.main_vaccines_first;
    if (numOfVaccines === 2) number = language.main_vaccines_second;
    if (numOfVaccines === 3) number = language.main_vaccines_third;

    return language.main_vaccines_text(number);
};

export default function Main() {
    // console.log("Render Main");

    const { LANGUAGES, setLanguage, language } = useContext(Language);
    const { clamp } = useContext(Utils);
    const { userCaughtCovid, updateVaccines, userNoLongerHasCovid } = useContext(API);
    const { STATE, set } = useContext(GlobalState);
    const [userInfo, setUserInfo] = useGlobalState(STATE.userInfo);

    // #################################################
    //   LANGUAGE
    // #################################################

    const [selectedLanguage, setSelectedLanguage] = useState(language.key);

    const handleLanguageSelected = (lang) => {
        if (lang === language.key) return;

        set(STATE.languagePopupVisible, false);
        setSelectedLanguage(lang);
        setLanguage(lang);
    };

    // #################################################
    //   LOAD DATA & LOCATION
    // #################################################

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

    // #################################################
    //   ACTION
    // #################################################

    const handleUserHasCovid = useCallback(async () => {
        set(STATE.covidPopupVisible, false);

        const response = await userCaughtCovid(userInfo._id);
        if (response.error) return;

        setUserInfo({ ...userInfo, hasCovid: response.hasCovid, covidStartDate: response.covidStartDate });
    }, [set, STATE, userCaughtCovid, userInfo, setUserInfo]);

    const handleUserNoLongerHasCovid = useCallback(async () => {
        const response = await userNoLongerHasCovid(userInfo._id);
        if (response.error) return;

        setUserInfo({ ...userInfo, hasCovid: response.hasCovid, covidStartDate: response.covidStartDate });
    }, [userNoLongerHasCovid, userInfo, setUserInfo]);

    const handleUserHasRecievedVaccine = useCallback(async () => {
        set(STATE.vaccinesPopupVisible, false);

        const response = await updateVaccines(userInfo._id, userInfo.numberOfVaccines + 1);
        if (response.error) return;

        setUserInfo({ ...userInfo, numberOfVaccines: response.numberOfVaccines });
    }, [set, STATE, updateVaccines, userInfo, setUserInfo]);

    // #################################################
    //   RENDER
    // #################################################

    let middleButton = <Button text={language.main_covidButton} onClick={() => set(STATE.covidPopupVisible, true)} />;

    const noLongerCovidDone = useRef(false);

    if (userInfo && "hasCovid" in userInfo && userInfo.hasCovid) {
        var today = new Date();
        var covidDate = new Date(userInfo.covidStartDate);
        var daysSinceCovid = Math.floor((today.getTime() - covidDate.getTime()) / (1000 * 3600 * 24));

        if (daysSinceCovid >= 10 && !noLongerCovidDone.current) {
            noLongerCovidDone.current = true;
            handleUserNoLongerHasCovid();
        } else
            middleButton = (
                <Button
                    text={language.main_lockdownDaysButton(clamp(10 - daysSinceCovid, 0, 10))}
                    onClick={() => set(STATE.infoPopupVisible, true)}
                />
            );
    }

    return (
        coords && (
            <div className="main">
                <Map coords={coords} />
                <CurrentLocation />

                <div className="mainButtons">
                    <Button
                        svg={InfoIcon}
                        onClick={() => set(STATE.infoPopupVisible, true)}
                        style={{ paddingRight: 0 }}
                    />
                    {middleButton}
                    <Button
                        svg={VaccineIcon}
                        onClick={() => set(STATE.vaccinesPopupVisible, true)}
                        style={{ paddingLeft: 0 }}
                        disabled={userInfo && "numberOfVaccines" in userInfo && userInfo.numberOfVaccines >= 3}
                    />
                </div>

                <Tab />

                <Popup globalStateVariable={STATE.covidPopupVisible}>
                    <div className="scroll">
                        <h1>{language.main_popup_covidTitle}</h1>
                        <p>{language.main_popup_0}</p>

                        <h2>{language.main_popup_1}</h2>
                        <p>{language.main_popup_2}</p>
                        <p>{language.main_popup_3}</p>
                        <h2>{language.main_popup_4}</h2>
                        <p>{language.main_popup_5}</p>
                        <h2>{language.main_popup_6}</h2>
                        <p>{language.main_popup_7}</p>
                        <h2>{language.main_popup_8}</h2>
                        <p>{language.main_popup_9}</p>
                        <p>{language.main_popup_10}</p>
                        <ul>
                            <li>{language.main_popup_11}</li>
                            <li>{language.main_popup_12}</li>
                            <li>{language.main_popup_13}</li>
                            <li>{language.main_popup_14}</li>
                            <li>{language.main_popup_15}</li>
                        </ul>

                        <p className="small">{language.main_popup_16}</p>
                    </div>

                    <Button text={language.main_popup_confirmCovid} onClick={handleUserHasCovid} />
                    <Button
                        text={language.main_popup_cancel}
                        onClick={() => set(STATE.covidPopupVisible, false)}
                        styleButton={{ backgroundColor: "rgb(245, 245, 245)" }}
                    />
                    <p className="small">{language.anonymousData}</p>
                </Popup>

                <Popup globalStateVariable={STATE.infoPopupVisible}>
                    <div className="scroll">
                        <h1>{language.main_popup_infoTitle}</h1>
                        <p>{language.main_popup_0}</p>

                        <h2>{language.main_popup_1}</h2>
                        <p>{language.main_popup_2}</p>
                        <p>{language.main_popup_3}</p>
                        <h2>{language.main_popup_4}</h2>
                        <p>{language.main_popup_5}</p>
                        <h2>{language.main_popup_6}</h2>
                        <p>{language.main_popup_7}</p>
                        <h2>{language.main_popup_8}</h2>
                        <p>{language.main_popup_9}</p>
                        <p>{language.main_popup_10}</p>
                        <ul>
                            <li>{language.main_popup_11}</li>
                            <li>{language.main_popup_12}</li>
                            <li>{language.main_popup_13}</li>
                            <li>{language.main_popup_14}</li>
                            <li>{language.main_popup_15}</li>
                        </ul>
                        <p className="small">{language.main_popup_16}</p>
                    </div>

                    <Button text={language.main_popup_close} onClick={() => set(STATE.infoPopupVisible, false)} />
                </Popup>

                <Popup globalStateVariable={STATE.vaccinesPopupVisible}>
                    <div className="scroll">
                        <h1>
                            {getVaccineText(
                                language,
                                userInfo && "numberOfVaccines" in userInfo ? userInfo.numberOfVaccines + 1 : 1
                            )}
                        </h1>
                    </div>

                    <Button text={language.main_popup_yes} onClick={handleUserHasRecievedVaccine} />
                    <Button
                        text={language.main_popup_no}
                        onClick={() => set(STATE.vaccinesPopupVisible, false)}
                        styleButton={{ backgroundColor: "rgb(245, 245, 245)" }}
                    />
                    <p className="small">{language.anonymousData}</p>
                </Popup>

                <Popup globalStateVariable={STATE.languagePopupVisible}>
                    <h1>{language.main_language}</h1>
                    {Object.keys(LANGUAGES).map((elem) => (
                        <Button
                            key={elem}
                            extraClass={selectedLanguage === elem ? "selected" : ""}
                            text={LANGUAGES[elem]}
                            onClick={() => handleLanguageSelected(elem)}
                            styleButton={{ backgroundColor: "rgb(245, 245, 245)" }}
                        />
                    ))}
                </Popup>
            </div>
        )
    );
}
