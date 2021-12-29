import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import Main from "./components/Main";
import InitialJourney from "./components/InitialJourney";
import Loading from "./components/Loading";
import { Utils } from "./contexts/Utils";
import { API } from "./contexts/API";
import { Data } from "./contexts/Data";
import { GlobalState } from "./contexts/GlobalState";

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
            if ("error" in response) return;

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

            var minAndMaxCasesPerCapita = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };

            // Calculate Cases per Capita
            covidDataProvinces.current.forEach((dateData) => {
                provinces.current.forEach(({ population, id_covid }) => {
                    const casesPerCapita = dateData[id_covid].today_new_confirmed / population;

                    dateData[id_covid].casesPerCapita = casesPerCapita;

                    minAndMaxCasesPerCapita.min = Math.min(minAndMaxCasesPerCapita.min, casesPerCapita);
                    minAndMaxCasesPerCapita.max = Math.max(minAndMaxCasesPerCapita.max, casesPerCapita);
                });
            });

            // Calculate Risk value
            covidDataProvinces.current.forEach((dateData) => {
                provinces.current.forEach(({ id_covid }) => {
                    const riskValue = Math.sqrt(
                        invlerp(0, minAndMaxCasesPerCapita.max, dateData[id_covid].casesPerCapita)
                    );

                    dateData[id_covid].riskValue = riskValue;
                });
            });

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

    return (
        <div className="app">
            {initialJourney}
            {main}
            {loading}
        </div>
    );
}
