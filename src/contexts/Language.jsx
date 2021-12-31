import React, { createContext, useState, useEffect, useContext } from "react";
import { API } from "./API";

export const Language = createContext();

const LANGUAGES = {
    SPANISH: "Español",
    CATALAN: "Català",
    ENGLISH: "English",
};

const SPANISH = { name: "Español", code: "es" };
const CATALAN = { name: "Català", code: "ca" };
const ENGLISH = { name: "English", code: "en" };

const LanguageProvider = (props) => {
    const { getLocationInfo, getGoogleMapsAPIKey } = useContext(API);

    // #################################################
    //   LANGUAGE
    // #################################################

    const [language, set] = useState(SPANISH);

    const setLanguage = (lang) => {
        if (lang === LANGUAGES.SPANISH) set(SPANISH);
        if (lang === LANGUAGES.CATALAN) set(CATALAN);
        if (lang === LANGUAGES.ENGLISH) set(ENGLISH);
    };

    // #################################################
    //   INITIAL LOCATION
    // #################################################

    useEffect(() => {
        const getLocation = async () => {
            if (navigator.geolocation) {
                await getGoogleMapsAPIKey();

                navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                    const { latitude, longitude } = coords;
                    const result = await getLocationInfo({ lat: latitude, lng: longitude }, "es");
                    if (result.status !== "OK" && result.status !== "ZERO_RESULTS") return;

                    if (result.results.length) {
                        const location = result.results[0].address_components[1].long_name;
                        if (
                            location === "Barcelona" ||
                            location === "Girona" ||
                            location === "Lérida" ||
                            location === "Tarragona"
                        )
                            set(CATALAN);
                    }
                });
            }
        };

        getLocation();
    }, []);

    return (
        <Language.Provider
            value={{
                LANGUAGES,
                language,
                setLanguage,
            }}
        >
            {props.children}
        </Language.Provider>
    );
};

export default LanguageProvider;
