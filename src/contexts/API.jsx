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
                `${GOOGLE_API_URL}geocode/json?latlng=${coords.lat},${coords.lng}&key=${googleAPIKey.current}&language=es&result_type=administrative_area_level_2|administrative_area_level_3|administrative_area_level_4`
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
            // let today = new Date().toISOString().split("T")[0];
            let date = new Date();
            date.setDate(date.getDate() - 0);
            date = date.toISOString().split("T")[0];

            // Fetch
            var rawResponse = await fetch(`${COVID_API_URL}${date}/country/spain`);

            // Get data from response
            const response = await rawResponse.json();

            // Cleanup response
            const cleanResponse = response.dates[date].countries.Spain;

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
    //   REST API
    // #################################################

    const createUser = async (numberOfVaccines, provinceId, autonomicCommunityId) => {
        // Post data
        var postData = { numberOfVaccines, provinceId, autonomicCommunityId };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/createUser`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const getUserInfo = async (id) => {
        // Post data
        var postData = { id };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/getUserInfo`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const userCaughtCovid = async (id) => {
        // Post data
        var postData = { id };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/userCaughtCovid`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const userNoLongerHasCovid = async (id) => {
        // Post data
        var postData = { id };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/userNoLongerHasCovid`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const updateVaccines = async (id, numberOfVaccines) => {
        // Post data
        var postData = { id, numberOfVaccines };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/updateVaccines`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const updateLocation = async (id, provinceId, autonomicCommunityId) => {
        // Post data
        var postData = { id, provinceId, autonomicCommunityId };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/updateLocation`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const getprovinceCovidInfo = async (provinceId) => {
        // Post data
        var postData = { provinceId };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/getprovinceCovidInfo`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const getAutonomicCommunityCovidInfo = async (autonomicCommunityId) => {
        // Post data
        var postData = { autonomicCommunityId };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/getAutonomicCommunityCovidInfo`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const getHistoricProvinceCovidInfo = async (provinceId) => {
        // Post data
        var postData = { provinceId };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/getHistoricProvinceCovidInfo`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
        }
    };

    const getHistoricAutonomicCommunityCovidInfo = async (autonomicCommunityId) => {
        // Post data
        var postData = { autonomicCommunityId };

        try {
            // Fetch
            var rawResponse = await fetch(`${API_URL}${API_VERSION}/getHistoricAutonomicCommunityCovidInfo`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return { error: `Error getting location info: ${error}` };
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

                // COVID
                getCovidData,

                // API
                createUser,
                getUserInfo,
                userCaughtCovid,
                userNoLongerHasCovid,
                updateVaccines,
                updateLocation,
                getprovinceCovidInfo,
                getAutonomicCommunityCovidInfo,
                getHistoricProvinceCovidInfo,
                getHistoricAutonomicCommunityCovidInfo,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
