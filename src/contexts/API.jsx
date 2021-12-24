import React, { createContext, useRef, useEffect, useState } from "react";
export const API = createContext();

// API version
const API_VERSION = "api_v1";
const API_URL = "https://estado-covid.herokuapp.com/"; // "http://localhost:3100/"
const GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/";
const COVID_API_URL = "https://api.covid19tracking.narrativa.com/api/";

const APIProvider = (props) => {
    const [googleAPIKeyLoaded, setGoogleAPIKeyLoaded] = useState(false);
    const googleAPIKey = useRef();

    // #################################################
    //   GOOGLE MAPS
    // #################################################

    const getGoogleMapsAPIKey = async () => {
        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/getGoogleAPIKey`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });

            // Get data from response
            const response = await rawResponse.json();

            googleAPIKey.current = response.googleAPIKey;
            setGoogleAPIKeyLoaded(true);

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const getLocationInfo = async (coords) => {
        try {
            // Fetch
            var rawResponse = await fetch(
                `${GOOGLE_API_URL}geocode/json?latlng=${coords.lat},${coords.lng}&key=${googleAPIKey.current}&language=es&result_type=administrative_area_level_3|administrative_area_level_4`
            );

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    // #################################################
    //   COVID
    // #################################################

    const getCovidData = async () => {
        try {
            let today = new Date().toISOString().split("T")[0];

            // Fetch
            var rawResponse = await fetch(`${COVID_API_URL}${today}/country/spain`);

            // Get data from response
            const response = await rawResponse.json();

            // Cleanup response
            const cleanResponse = response.dates[today].countries.Spain;

            // Separate Data
            const spainData = (({ regions, ...rest }) => rest)(cleanResponse);
            const autonomicCommunitiesData = {};
            const provincesData = {};
            cleanResponse.regions.forEach((region) => {
                autonomicCommunitiesData[region.id] = (({ sub_regions, ...rest }) => rest)(region);
                if (region.sub_regions.length)
                    region.sub_regions.forEach((subRegion) => (provincesData[subRegion.id] = subRegion));
                else provincesData[region.id] = region;
            });

            // Return response
            return { spainData, autonomicCommunitiesData, provincesData };
        } catch (error) {
            return { error: `Error getting regions for spain: ${error}` };
        }
    };

    // #################################################
    //   CONTECT MOUNT
    // #################################################

    useEffect(() => {
        getGoogleMapsAPIKey();
    }, []);

    // Return the context
    return (
        <API.Provider
            value={{
                // GOOGLE MAPS
                googleAPIKeyLoaded,
                googleAPIKey,
                getLocationInfo,

                //   COVID
                getCovidData,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
