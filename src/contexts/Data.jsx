import React, { createContext, useRef } from "react";
import provincesData from "../resources/data/provinces.json";
export const Data = createContext();

const DataProvider = (props) => {
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
    return (
        <Data.Provider
            value={{
                // PROVINCES
                provinces,

                // COVID DATA
                covidDataSpain,
                covidDataAutonomicCommunities,
                covidDataProvinces,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
