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
            let initialDate = new Date();
            initialDate.setDate(initialDate.getDate() - 14);
            initialDate = initialDate.toISOString().split("T")[0];

            let finalDate = new Date();
            finalDate = finalDate.toISOString().split("T")[0];

            // Fetch
            var rawResponse = await fetch(
                `${COVID_API_URL}/country/spain?date_from=${initialDate}&date_to=${finalDate}`
            );

            // Get data from response
            const response = await rawResponse.json();

            const spainData = [];
            const autonomicCommunitiesData = [];
            const provincesData = [];

            Object.values(response.dates).forEach((data) => {
                // Cleanup response
                const cleanResponse = data.countries.Spain;

                // Spain
                spainData.push((({ regions, ...rest }) => rest)(cleanResponse));
                autonomicCommunitiesData.push({});
                provincesData.push({});

                cleanResponse.regions.forEach((region) => {
                    // Autonomic communities
                    autonomicCommunitiesData[autonomicCommunitiesData.length - 1][region.id] = (({
                        sub_regions,
                        ...rest
                    }) => rest)(region);

                    // Provinces
                    if (region.sub_regions.length)
                        region.sub_regions.forEach(
                            (subRegion) => (provincesData[provincesData.length - 1][subRegion.id] = subRegion)
                        );
                    // Provinces that are equal to the autonomic community
                    else provincesData[provincesData.length - 1][region.id] = region;
                });
            });

            // Fix mistakes in the data -> Spain
            var lastNewConfirmedCases = 0;
            spainData.forEach((elem) => {
                if (elem.today_confirmed === elem.today_new_confirmed) elem.today_new_confirmed = lastNewConfirmedCases;
                else lastNewConfirmedCases = elem.today_new_confirmed;
            });

            // Fix mistakes in the data -> Autonomic Communities
            lastNewConfirmedCases = {};
            autonomicCommunitiesData.forEach((elem) => {
                for (const [key, value] of Object.entries(elem)) {
                    if (value.today_confirmed === value.today_new_confirmed)
                        value.today_new_confirmed = key in lastNewConfirmedCases ? lastNewConfirmedCases[key] : 0;
                    else lastNewConfirmedCases[key] = value.today_new_confirmed;
                }
            });

            // Fix mistakes in the data -> Provinces
            lastNewConfirmedCases = {};
            provincesData.forEach((elem) => {
                for (const [key, value] of Object.entries(elem)) {
                    if (value.today_confirmed === value.today_new_confirmed)
                        value.today_new_confirmed = key in lastNewConfirmedCases ? lastNewConfirmedCases[key] : 0;
                    else lastNewConfirmedCases[key] = value.today_new_confirmed;
                }
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
