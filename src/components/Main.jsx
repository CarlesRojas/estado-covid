import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import Map from "./Map";
import CurrentLocation from "./CurrentLocation";
import Button from "./Button";
import Label from "./Label";
import Tab from "./Tab";
import Popup from "./Popup";
import { API } from "../contexts/API";
import { Utils } from "../contexts/Utils";
import { GlobalState } from "../contexts/GlobalState";
import useGlobalState from "../hooks/useGlobalState";

import InfoIcon from "../resources/icons/info.svg";
import VaccineIcon from "../resources/icons/vaccine.svg";

const getVaccineText = (numOfVaccines) => {
    var number = "primera";
    if (numOfVaccines === 2) number = "segunda";
    if (numOfVaccines === 3) number = "tercera";

    return `Le han puesto la ${number} dosis de la vacuna?`;
};

export default function Main() {
    // console.log("Render Main");

    const { clamp } = useContext(Utils);
    const { userCaughtCovid, updateVaccines, userNoLongerHasCovid } = useContext(API);
    const { STATE, set } = useContext(GlobalState);
    const [userInfo, setUserInfo] = useGlobalState(STATE.userInfo);

    // #################################################
    //   LOAD DATA & LOCATION
    // #################################################

    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            if (navigator.geolocation)
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    const { latitude, longitude } = coords;
                    setCoords({ lat: latitude, lng: longitude });
                });
        };

        getLocation();
    }, []);

    // #################################################
    //   ACTION
    // #################################################

    const handleUserHasCovid = useCallback(async () => {
        set(STATE.covidPopupVisible, false);

        const response = await userCaughtCovid(userInfo._id);
        if (response.error) return;

        setUserInfo({ ...userInfo, hasCovid: response.hasCovid, covidStartDate: response.covidStartDate });
    }, [set, STATE, userCaughtCovid, userInfo, setUserInfo]);

    const handleUserNoLongerHasCovid = useCallback(async () => {
        const response = await userNoLongerHasCovid(userInfo._id);
        if (response.error) return;

        setUserInfo({ ...userInfo, hasCovid: response.hasCovid, covidStartDate: response.covidStartDate });
    }, [userNoLongerHasCovid, userInfo, setUserInfo]);

    const handleUserHasRecievedVaccine = useCallback(async () => {
        set(STATE.vaccinesPopupVisible, false);

        const response = await updateVaccines(userInfo._id, userInfo.numberOfVaccines + 1);
        if (response.error) return;

        setUserInfo({ ...userInfo, numberOfVaccines: response.numberOfVaccines });
    }, [set, STATE, updateVaccines, userInfo, setUserInfo]);

    // #################################################
    //   RENDER
    // #################################################

    let middleButton = <Button text={"Tengo Covid-19"} onClick={() => set(STATE.covidPopupVisible, true)} />;

    const noLongerCovidDone = useRef(false);

    if (userInfo && "hasCovid" in userInfo && userInfo.hasCovid) {
        var today = new Date();
        var covidDate = new Date(userInfo.covidStartDate);
        var daysSinceCovid = Math.floor((today.getTime() - covidDate.getTime()) / (1000 * 3600 * 24));

        if (daysSinceCovid >= 10 && !noLongerCovidDone.current) {
            noLongerCovidDone.current = true;
            handleUserNoLongerHasCovid();
        } else middleButton = <Label text={`Dias restantes confinado: ${clamp(10 - daysSinceCovid, 0, 10)}`} />;
    }

    return (
        coords && (
            <div className="main">
                <Map coords={coords} />
                <CurrentLocation />

                <div className="mainButtons">
                    <Button
                        svg={InfoIcon}
                        onClick={() => set(STATE.infoPopupVisible, true)}
                        style={{ paddingRight: 0 }}
                    />
                    {middleButton}
                    <Button
                        svg={VaccineIcon}
                        onClick={() => set(STATE.vaccinesPopupVisible, true)}
                        style={{ paddingLeft: 0 }}
                        disabled={userInfo && "numberOfVaccines" in userInfo && userInfo.numberOfVaccines >= 3}
                    />
                </div>

                <Tab />

                <Popup globalStateVariable={STATE.covidPopupVisible}>
                    <div className="scroll">
                        <h1>Que no cunda el pánico!</h1>
                        <p>Lea atentamente las siguientes pautas a seguir:</p>

                        <h2>Quédese en casa excepto para recibir atención médica</h2>
                        <p>
                            La mayoría de las personas con COVID-19 padecen síntomas leves y pueden recuperarse en casa
                            sin atención médica. No salga de su casa, excepto para recibir atención médica. No visite
                            áreas públicas.
                        </p>
                        <p>Llame antes de recibir atención médica.</p>
                        <h2>Sepárese de otras personas</h2>
                        <p>
                            En la medida de lo posible, permanezca en una habitación específica y lejos de otras
                            personas y mascotas en su hogar. Si es posible, debe usar un baño separado. Si necesita
                            estar cerca de otras personas o animales dentro o fuera de la casa, use una máscara.
                        </p>
                        <h2>Dígale a sus contactos cercanos que pueden haber estado expuestos al COVID-19.</h2>
                        <p>
                            Una persona infectada puede transmitir COVID-19 a partir de 48 horas (o 2 días) antes de que
                            la persona presente algún síntoma o dé positivo en la prueba.
                        </p>
                        <h2>Controle sus síntomas.</h2>
                        <p>Los síntomas más comunes de COVID-19 incluyen fiebre y tos.</p>
                        <p>Si muestra alguno de estos signos, busque atención médica de emergencia de inmediato:</p>
                        <ul>
                            <li>Dificultad para respirar.</li>
                            <li>Dolor o presión persistente en el pecho.</li>
                            <li>Estado nuevo de confusión</li>
                            <li>Incapacidad para despertar o permanecer despierto.</li>
                            <li>Piel, labios o alrededor de las uñas descoloridas.</li>
                        </ul>
                        <p className="small">
                            Esta lista no incluye todos los síntomas posibles. Llame a su médico por cualquier otro
                            síntoma que sea grave o que le preocupe.
                        </p>
                    </div>

                    <Button text={"Confirmar"} onClick={handleUserHasCovid} />
                    <Button
                        text={"Cancelar"}
                        onClick={() => set(STATE.covidPopupVisible, false)}
                        styleButton={{ backgroundColor: "rgb(245, 245, 245)" }}
                    />
                </Popup>

                <Popup globalStateVariable={STATE.infoPopupVisible}>
                    <div className="scroll">
                        <h1>Como actuar si cree que tiene Covid-19</h1>
                        <p>Lea atentamente las siguientes pautas a seguir:</p>

                        <h2>Quédese en casa excepto para recibir atención médica</h2>
                        <p>
                            La mayoría de las personas con COVID-19 padecen síntomas leves y pueden recuperarse en casa
                            sin atención médica. No salga de su casa, excepto para recibir atención médica. No visite
                            áreas públicas.
                        </p>
                        <p>Llame antes de recibir atención médica.</p>
                        <h2>Sepárese de otras personas</h2>
                        <p>
                            En la medida de lo posible, permanezca en una habitación específica y lejos de otras
                            personas y mascotas en su hogar. Si es posible, debe usar un baño separado. Si necesita
                            estar cerca de otras personas o animales dentro o fuera de la casa, use una máscara.
                        </p>
                        <h2>Dígale a sus contactos cercanos que pueden haber estado expuestos al COVID-19.</h2>
                        <p>
                            Una persona infectada puede transmitir COVID-19 a partir de 48 horas (o 2 días) antes de que
                            la persona presente algún síntoma o dé positivo en la prueba.
                        </p>
                        <h2>Controle sus síntomas.</h2>
                        <p>Los síntomas más comunes de COVID-19 incluyen fiebre y tos.</p>
                        <p>Si muestra alguno de estos signos, busque atención médica de emergencia de inmediato:</p>
                        <ul>
                            <li>Dificultad para respirar.</li>
                            <li>Dolor o presión persistente en el pecho.</li>
                            <li>Estado nuevo de confusión</li>
                            <li>Incapacidad para despertar o permanecer despierto.</li>
                            <li>Piel, labios o alrededor de las uñas descoloridas.</li>
                        </ul>
                        <p className="small">
                            Esta lista no incluye todos los síntomas posibles. Llame a su médico por cualquier otro
                            síntoma que sea grave o que le preocupe.
                        </p>
                    </div>

                    <Button text={"Cerrar"} onClick={() => set(STATE.infoPopupVisible, false)} />
                </Popup>

                <Popup globalStateVariable={STATE.vaccinesPopupVisible}>
                    <div className="scroll">
                        <h1>
                            {getVaccineText(
                                userInfo && "numberOfVaccines" in userInfo ? userInfo.numberOfVaccines + 1 : 1
                            )}
                        </h1>
                    </div>

                    <Button text={"Si"} onClick={handleUserHasRecievedVaccine} />
                    <Button
                        text={"No"}
                        onClick={() => set(STATE.vaccinesPopupVisible, false)}
                        styleButton={{ backgroundColor: "rgb(245, 245, 245)" }}
                    />
                </Popup>
            </div>
        )
    );
}
