import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";

// Contexts
import LanguageProvider from "./contexts/Language";
import EventsProvider from "./contexts/Events";
import GlobalStateProvider from "./contexts/GlobalState";
import UtilsProvider from "./contexts/Utils";
import DataProvider from "./contexts/Data";
import APIProvider from "./contexts/API";

// Render React App
ReactDOM.render(
    <EventsProvider>
        <UtilsProvider>
            <APIProvider>
                <LanguageProvider>
                    <GlobalStateProvider>
                        <DataProvider>
                            <App />
                        </DataProvider>
                    </GlobalStateProvider>
                </LanguageProvider>
            </APIProvider>
        </UtilsProvider>
    </EventsProvider>,
    document.getElementById("root")
);

// Register service worker
serviceWorker.register();
