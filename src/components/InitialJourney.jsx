import React, { useContext, useState, useCallback } from "react";
import classnames from "classnames";
import { API } from "../contexts/API";
import { Utils } from "../contexts/Utils";
import { GlobalState } from "../contexts/GlobalState";
import { Language } from "../contexts/Language";

import Button from "./Button";

const VACCINES = [0, 1, 2, 3];
const AGE_RANGES = ["0-20", "21-40", "41-61", "61+"];

export default function InitialJourney({ setInitialJourneyComplete }) {
    // console.log("Render Initial Journey");

    const { createUser } = useContext(API);
    const { setCookie } = useContext(Utils);
    const { language } = useContext(Language);
    const { STATE, set } = useContext(GlobalState);

    const [error, setError] = useState(false);
    const [numberOfVaccines, setNumberOfVaccines] = useState(VACCINES[0]);
    const [ageRange, setAgeRange] = useState(AGE_RANGES[1]);

    const handleContinueClick = useCallback(async () => {
        const response = await createUser(numberOfVaccines, ageRange);

        if (response.error) {
            setError(true);
            return;
        }

        set(STATE.userInfo, response);

        setCookie("estado_covid_user_id", response._id, 365 * 50);

        setInitialJourneyComplete(true);
    }, [createUser, numberOfVaccines, ageRange, setInitialJourneyComplete, setCookie, set, STATE]);

    return (
        <div className="initialJourney">
            <div className="contentContainer">
                <div className="scroll">
                    <h1>{language.initialJourney_title}</h1>

                    <h2>{language.initialJourney_vaccinesQuestion}</h2>
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

                    <h2>{language.initialJourney_ageQuestion}</h2>
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

                    <p className="small">{language.anonymousData}</p>
                </div>

                <div className={classnames("error", { visible: error })}>{language.initialJourney_error}</div>
                <Button text={language.initialJourney_continue} onClick={handleContinueClick} />
            </div>
        </div>
    );
}
