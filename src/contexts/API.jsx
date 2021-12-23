import React, { createContext } from "react";
export const API = createContext();

// API version
const API_VERSION = "api_v1";

const APIProvider = (props) => {
    const apiURL =
        process.env.NODE_ENV === "production" ? "https://estado-covid.herokuapp.com/" : "http://localhost:3100/";

    const demoAPICall = async () => {
        // Post data
        var postData = {};

        try {
            // Fetch
            var rawResponse = await fetch(`${apiURL}${API_VERSION}/endpoint`, {
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
            return { error: `Error calling api endpoint ${error}` };
        }
    };

    // Return the context
    return (
        <API.Provider
            value={{
                demoAPICall,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
