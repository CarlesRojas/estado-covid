import React, { useState, useContext, useEffect } from "react";
import Main from "./components/Main";
import InitialJourney from "./components/InitialJourney";
import { Utils } from "./contexts/Utils";

export default function App() {
    const { getCookie } = useContext(Utils);
    console.log("Render App");

    const [showInitialJourney, setShowInitialJourney] = useState(false);
    const [showMainPage, setShowMainPage] = useState(false);

    useEffect(() => {
        const userId = getCookie("estado_covid_user_id");

        if (userId) setShowInitialJourney(true);
        else setShowMainPage(true);
    }, [getCookie]);

    return (
        <div className="app">
            {showInitialJourney && <InitialJourney />}
            {showMainPage && <Main />}
        </div>
    );
}
