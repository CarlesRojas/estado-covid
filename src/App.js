import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import Main from "./components/Main";
import InitialJourney from "./components/InitialJourney";
import Loading from "./components/Loading";
import { Utils } from "./contexts/Utils";
import { API } from "./contexts/API";
import { Data } from "./contexts/Data";
import { GlobalState } from "./contexts/GlobalState";
import { isMobileOnly } from "react-device-detect";
import SVG from "react-inlinesvg";

import LogoIcon from "./resources/icons/iconWhite.svg";
import QR from "./resources/qr.png";

export default function App() {
    // console.log("Render App");

    const { STATE, set } = useContext(GlobalState);
    const { getCookie, invlerp } = useContext(Utils);
    const { getCovidData, getGoogleMapsAPIKey, getUserInfo } = useContext(API);
    const { provinces, covidDataSpain, covidDataAutonomicCommunities, covidDataProvinces } = useContext(Data);

    // #################################################
    //   SHOW APPROPIATE SCREEN
    // #################################################

    const [initialJourneyComplete, setInitialJourneyComplete] = useState(null);

    const getUser = useCallback(
        async (id) => {
            const response = await getUserInfo(id);
            if (!response || "error" in response) {
                setInitialJourneyComplete(false);
                return;
            }

            set(STATE.userInfo, response);
            setInitialJourneyComplete(true);
        },
        [getUserInfo, setInitialJourneyComplete, set, STATE]
    );

    useEffect(() => {
        const userId = getCookie("estado_covid_user_id");

        if (userId) getUser(userId);
        else setInitialJourneyComplete(false);
    }, [getCookie, getUser]);

    // #################################################
    //   GET COVID DATA
    // #################################################

    const covidDataFetched = useRef(false);
    const [covidDataLoaded, setCovidDataLoaded] = useState(false);

    useEffect(() => {
        const getData = async () => {
            covidDataFetched.current = true;
            const { spainData, autonomicCommunitiesData, provincesData } = await getCovidData();

            covidDataSpain.current = spainData;
            covidDataAutonomicCommunities.current = autonomicCommunitiesData;
            covidDataProvinces.current = provincesData;

            var minMaxNewCasesPerCapita = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };

            // Calculate Cases per Capita
            covidDataProvinces.current.forEach((dateData) => {
                provinces.current.forEach(({ population, id_covid }) => {
                    const newCasesPerCapita = dateData[id_covid].today_new_confirmed / population;
                    const casesPerCapita = dateData[id_covid].today_confirmed / population;

                    dateData[id_covid].newCasesPerCapita = newCasesPerCapita;
                    dateData[id_covid].casesPerCapita = casesPerCapita;
                    dateData[id_covid].population = population;

                    minMaxNewCasesPerCapita.min = Math.min(minMaxNewCasesPerCapita.min, newCasesPerCapita);
                    minMaxNewCasesPerCapita.max = Math.max(minMaxNewCasesPerCapita.max, newCasesPerCapita);
                });
            });

            // Calculate Risk value
            covidDataProvinces.current.forEach((dateData) => {
                provinces.current.forEach(({ id_covid }) => {
                    const riskValue = Math.sqrt(
                        invlerp(0, minMaxNewCasesPerCapita.max, dateData[id_covid].newCasesPerCapita)
                    );

                    dateData[id_covid].riskValue = riskValue;
                });
            });

            // Calculate current active covid cases
            for (let i = covidDataProvinces.current.length - 1; i > 10; i--) {
                for (const key in covidDataProvinces.current[i]) {
                    var activeCovidCases = 0;
                    for (let j = 0; j < 10; j++) {
                        const element = covidDataProvinces.current[i - j][key];
                        activeCovidCases += element.today_new_confirmed;
                    }

                    covidDataProvinces.current[i][key].activeCovidCases = activeCovidCases;
                    covidDataProvinces.current[i][key].activeCovidCasesPerCapita =
                        activeCovidCases / covidDataProvinces.current[i][key].population;
                }
            }

            setCovidDataLoaded(true);
        };

        if (!covidDataFetched.current) getData();
    }, [getCovidData, covidDataSpain, covidDataAutonomicCommunities, covidDataProvinces, provinces, invlerp]);

    // #################################################
    //   GET GOOGLE API KEY
    // #################################################

    const googleAPIFetched = useRef(false);
    const [googleAPILoaded, setgoogleAPILoaded] = useState(false);

    useEffect(() => {
        const getGoogleAPIKey = async () => {
            googleAPIFetched.current = true;
            await getGoogleMapsAPIKey();
            setgoogleAPILoaded(true);
        };

        if (!googleAPIFetched.current) getGoogleAPIKey();
    }, [getGoogleMapsAPIKey]);

    // #################################################
    //   RENDER
    // #################################################

    const initialJourney = initialJourneyComplete === false && (
        <InitialJourney setInitialJourneyComplete={setInitialJourneyComplete} />
    );
    const main = initialJourneyComplete && covidDataLoaded && googleAPILoaded && <Main />;
    const loading = !initialJourney && !main && <Loading />;

    if (!isMobileOnly)
        return (
            <div className="onlyMobile">
                <div className="onlyMobileContainer">
                    <SVG className="icon" src={LogoIcon} />
                    <p className="text">La aplicación Covid-19 solo está disponible para móvil.</p>
                    <p className="subtitle">
                        Escanea este código QR para abrir-la en el móvil. Pedes añadirla la pantalla de inicio des de la
                        configuración de tu navegador.
                    </p>
                    <img src={QR} alt="" className="qrCode" />
                </div>
            </div>
        );

    return (
        <div className="app">
            {initialJourney}
            {main}
            {loading}
        </div>
    );
}
