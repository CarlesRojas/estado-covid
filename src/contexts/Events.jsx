import React, { createContext, useRef } from "react";
export const Events = createContext();

const EVENT_LIST = {
    // ON_DEVICE_CHANGE: "onDeviceChange", // Payload: string with the new device
};

const EventsProvider = (props) => {
    const events = useRef({});

    const sub = (eventName, func) => {
        events.current[eventName] = events.current[eventName] || [];
        events.current[eventName].push(func);
    };

    const unsub = (eventName, func) => {
        if (events.current[eventName])
            for (var i = 0; i < events.current[eventName].length; i++)
                if (events.current[eventName][i] === func) {
                    events.current[eventName].splice(i, 1);
                    break;
                }
    };

    const emit = (eventName, data) => {
        if (events.current[eventName])
            events.current[eventName].forEach(function (func) {
                func(data);
            });
    };

    // #######################################
    //      RENDER
    // #######################################

    return (
        <Events.Provider
            value={{
                EVENT_LIST,
                sub,
                unsub,
                emit,
            }}
        >
            {props.children}
        </Events.Provider>
    );
};

export default EventsProvider;
