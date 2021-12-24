import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";

// Contexts
import EventsProvider from "./contexts/Events";
import UtilsProvider from "./contexts/Utils";
import DataProvider from "./contexts/Data";
import APIProvider from "./contexts/API";

// Render React App
ReactDOM.render(
    <EventsProvider>
        <UtilsProvider>
            <APIProvider>
                <DataProvider>
                    <App />
                </DataProvider>
            </APIProvider>
        </UtilsProvider>
    </EventsProvider>,
    document.getElementById("root")
);
