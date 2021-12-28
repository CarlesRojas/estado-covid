import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";

// Contexts
import EventsProvider from "./contexts/Events";
import GlobalStateProvider from "./contexts/GlobalState";
import UtilsProvider from "./contexts/Utils";
import DataProvider from "./contexts/Data";
import APIProvider from "./contexts/API";

// Render React App
ReactDOM.render(
    <StrictMode>
        <EventsProvider>
            <UtilsProvider>
                <APIProvider>
                    <GlobalStateProvider>
                        <DataProvider>
                            <App />
                        </DataProvider>
                    </GlobalStateProvider>
                </APIProvider>
            </UtilsProvider>
        </EventsProvider>
    </StrictMode>,
    document.getElementById("root")
);
