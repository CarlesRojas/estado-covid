import React, { useContext, useState, useCallback } from "react";
import classnames from "classnames";
import { API } from "../contexts/API";
import { Utils } from "../contexts/Utils";

import Button from "./Button";

const VACCINES = [0, 1, 2, 3];
const AGE_RANGES = ["0-20", "21-40", "41-61", "61+"];

export default function InitialJourney({ setInitialJourneyComplete }) {
    // console.log("Render Initial Journey");

    const { createUser } = useContext(API);
    const { setCookie } = useContext(Utils);

    const [error, setError] = useState(false);
    const [numberOfVaccines, setNumberOfVaccines] = useState(VACCINES[0]);
    const [ageRange, setAgeRange] = useState(AGE_RANGES[1]);

    const handleContinueClick = useCallback(async () => {
        const response = await createUser(numberOfVaccines, ageRange);

        if (response.error) {
            setError(true);
            return;
        }

        setCookie("estado_covid_user_id", response._id, 365 * 50);

        setInitialJourneyComplete(true);
    }, [createUser, numberOfVaccines, ageRange, setInitialJourneyComplete, setCookie]);

    return (
        <div className="initialJourney">
            <div className="contentContainer">
                <div className="scroll">
                    <h1>Cuéntanos un poco sobre ti.</h1>

                    <h2>¿Cuántas vacunas de Covid-19 has recibido?</h2>
                    <div className="options">
                        {VACCINES.map((elem) => (
                            <div
                                key={elem}
                                className={classnames("item", { selected: numberOfVaccines === elem })}
                                onClick={() => setNumberOfVaccines(elem)}
                            >
                                {elem}
                            </div>
                        ))}
                    </div>

                    <h2>¿Cuál es tu rango de edad?</h2>
                    <div className="options wide">
                        {AGE_RANGES.map((elem) => (
                            <div
                                key={elem}
                                className={classnames("item", "wide", { selected: ageRange === elem })}
                                onClick={() => setAgeRange(elem)}
                            >
                                {elem}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={classnames("error", { visible: error })}>
                    Ha ocurrido un error. Reinténtelo más tarde.
                </div>
                <Button text={"Continuar"} onClick={handleContinueClick} />
            </div>
        </div>
    );
}
