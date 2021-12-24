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

    useEffect(() => {
        const getData = async () => {
            const { spainData, autonomicCommunitiesData, provincesData } = await getCovidData();

            covidDataSpain.current = spainData;
            covidDataAutonomicCommunities.current = autonomicCommunitiesData;
            covidDataProvinces.current = provincesData;

            // Calculate Cases per Capita
            provinces.current.forEach(({ population, id_covid }) => {
                const casesPerCapita = covidDataProvinces.current[id_covid].today_new_confirmed / population;

                covidDataProvinces.current[id_covid].casesPerCapita = casesPerCapita;

                minAndMaxCasesPerCapita.current.min = Math.min(minAndMaxCasesPerCapita.current.min, casesPerCapita);
                minAndMaxCasesPerCapita.current.max = Math.max(minAndMaxCasesPerCapita.current.max, casesPerCapita);
            });

            setDataLoaded(true);
        };

        getData();
    }, [getCovidData]);

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
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
