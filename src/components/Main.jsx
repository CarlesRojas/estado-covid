import React, { useState, useEffect, useContext } from "react";
import { Data } from "../contexts/Data";
import { API } from "../contexts/API";
import Map from "./Map";
import CurrentLocation from "./CurrentLocation";
import Button from "./Button";
import Tab from "./Tab";
import Popup from "./Popup";

export default function Main() {
    // #################################################
    //   LOAD DATA & LOCATION
    // #################################################

    const { dataLoaded } = useContext(Data);
    const { googleAPIKeyLoaded } = useContext(API);

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
    //   COVID POPUP
    // #################################################

    const [covidPopupVisible, setCovidPopupVisible] = useState(false);

    return (
        <div className="main">
            {coords && googleAPIKeyLoaded && dataLoaded && <Map coords={coords} />}
            <CurrentLocation />

            <Button text={"Tengo Covid-19"} onClick={() => setCovidPopupVisible(true)} />
            <Tab />

            <Popup visible={covidPopupVisible} setVisible={setCovidPopupVisible}>
                <div className="scroll">
                    <h1>Que no cunda el pánico!</h1>
                    <p>Lea atentamente las siguientes pautas a seguir:</p>

                    <h2>Quédese en casa excepto para recibir atención médica</h2>
                    <p>
                        La mayoría de las personas con COVID-19 padecen síntomas leves y pueden recuperarse en casa sin
                        atención médica. No salga de su casa, excepto para recibir atención médica. No visite áreas
                        públicas.
                    </p>
                    <p>Llame antes de recibir atención médica.</p>
                    <h2>Sepárese de otras personas</h2>
                    <p>
                        En la medida de lo posible, permanezca en una habitación específica y lejos de otras personas y
                        mascotas en su hogar. Si es posible, debe usar un baño separado. Si necesita estar cerca de
                        otras personas o animales dentro o fuera de la casa, use una máscara.
                    </p>
                    <h2>Dígale a sus contactos cercanos que pueden haber estado expuestos al COVID-19.</h2>
                    <p>
                        Una persona infectada puede transmitir COVID-19 a partir de 48 horas (o 2 días) antes de que la
                        persona presente algún síntoma o dé positivo en la prueba.
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
                        Esta lista no incluye todos los síntomas posibles. Llame a su médico por cualquier otro síntoma
                        que sea grave o que le preocupe.
                    </p>
                </div>

                <Button text={"Continuar"} onClick={() => setCovidPopupVisible(false)} />
            </Popup>
        </div>
    );
}
