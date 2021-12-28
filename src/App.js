import React, { useState, useContext, useEffect, useRef } from "react";
import Main from "./components/Main";
import InitialJourney from "./components/InitialJourney";
import Loading from "./components/Loading";
import { Utils } from "./contexts/Utils";
import { API } from "./contexts/API";
import { Data } from "./contexts/Data";

export default function App() {
    // console.log("Render App");

    const { getCookie } = useContext(Utils);
    const { getCovidData, getGoogleMapsAPIKey } = useContext(API);
    const { provinces, covidDataSpain, covidDataAutonomicCommunities, covidDataProvinces, minAndMaxCasesPerCapita } =
        useContext(Data);

    // #################################################
    //   SHOW APPROPIATE SCREEN
    // #################################################

    const [initialJourneyComplete, setInitialJourneyComplete] = useState(false);

    useEffect(() => {
        const userId = getCookie("estado_covid_user_id");

        // ROJAS invert condition
        if (!userId) setInitialJourneyComplete(true);
    }, [getCookie]);

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

            covidDataProvinces.current.forEach((dateData) => {
                // Calculate Cases per Capita
                provinces.current.forEach(({ population, id_covid }) => {
                    const casesPerCapita = dateData[id_covid].today_new_confirmed / population;

                    dateData[id_covid].casesPerCapita = casesPerCapita;

                    minAndMaxCasesPerCapita.current.min = Math.min(minAndMaxCasesPerCapita.current.min, casesPerCapita);
                    minAndMaxCasesPerCapita.current.max = Math.max(minAndMaxCasesPerCapita.current.max, casesPerCapita);
                });
            });

            setCovidDataLoaded(true);
        };

        if (!covidDataFetched.current) getData();
    }, [
        getCovidData,
        covidDataSpain,
        covidDataAutonomicCommunities,
        covidDataProvinces,
        minAndMaxCasesPerCapita,
        provinces,
    ]);

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

    const initialJourney = !initialJourneyComplete && <InitialJourney />;
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
