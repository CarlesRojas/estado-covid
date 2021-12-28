import React, { createContext, useRef, useEffect, useContext, useState } from "react";
import provincesData from "../resources/data/provinces.json";
import { API } from "../contexts/API";
export const Data = createContext();

const DataProvider = (props) => {
    const { getCovidData } = useContext(API);

    // #################################################
    //   PROVINCES
    // #################################################

    const provinces = useRef(provincesData);

    // #################################################
    //   COVID DATA
    // #################################################

    const covidDataSpain = useRef({});
    const covidDataAutonomicCommunities = useRef({});
    const covidDataProvinces = useRef({});
    const minAndMaxCasesPerCapita = useRef({ min: Number.MAX_VALUE, max: Number.MIN_VALUE });
    const [dataLoaded, setDataLoaded] = useState(false);
    const dataFetched = useRef(false);

    useEffect(() => {
        const getData = async () => {
            dataFetched.current = true;
            const { spainData, autonomicCommunitiesData, provincesData } = await getCovidData();

            covidDataSpain.current = spainData;
            covidDataAutonomicCommunities.current = autonomicCommunitiesData;
            covidDataProvinces.current = provincesData;

            covidDataProvinces.current.forEach((dateData) => {
                // Calculate Cases per Capita
                provinces.current.forEach(({ population, id_covid }) => {
                    const casesPerCapita = dateData[id_covid].today_confirmed / population;

                    dateData[id_covid].casesPerCapita = casesPerCapita;

                    minAndMaxCasesPerCapita.current.min = Math.min(minAndMaxCasesPerCapita.current.min, casesPerCapita);
                    minAndMaxCasesPerCapita.current.max = Math.max(minAndMaxCasesPerCapita.current.max, casesPerCapita);
                });
            });

            setDataLoaded(true);
        };

        if (!dataFetched.current) getData();
    }, [getCovidData]);

    // #################################################
    //   DATE SELECTOR
    // #################################################

    const [date, setDate] = useState(0);

    // #################################################
    //   CURRENT LOCATION
    // #################################################

    const [currentLocation, setCurrentLocation] = useState(null);

    // #################################################
    //   POPUP
    // #################################################

    const [popupContent, setPopupContent] = useState();

    return (
        <Data.Provider
            value={{
                // PROVINCES
                provinces,

                // COVID DATA
                covidDataSpain,
                covidDataAutonomicCommunities,
                covidDataProvinces,
                minAndMaxCasesPerCapita,
                dataLoaded,

                // DATE SELECTOR
                date,
                setDate,

                // CURRENT PROVINCE
                currentLocation,
                setCurrentLocation,

                // POPUP
                popupContent,
                setPopupContent,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
