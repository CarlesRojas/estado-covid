import React, { createContext, useState, useEffect, useContext } from "react";
import { API } from "./API";
import { Utils } from "./Utils";

export const Language = createContext();

const LANGUAGES = {
    SPANISH: "Español",
    CATALAN: "Català",
    ENGLISH: "English",
};

const SPANISH = {
    name: "Español",
    key: "SPANISH",
    code: "es",
    locale: "es-ES",

    // APP
    app_onlyPhone_title: "La aplicación Covid-19 solo está disponible para móvil.",
    app_onlyPhone_subtitle:
        "Escanea este código QR para abrir-la en el móvil. Pedes añadirla la pantalla de inicio des de la configuración de tu navegador.",

    // COVID DATA
    covidData_icons_distancing: "Respete una distancia social de 2m.",
    covidData_icons_gather: "No se reúna con más de 10 personas.",
    covidData_icons_lockdown: "Quédese en casa siempre que sea posible.",
    covidData_icons_mask: "Lleve mascarilla siempre fuera de casa.",
    covidData_icons_night: "Evite cualquier actividad nocturna.",
    covidData_icons_qr: "Pasaporte Covid-19 obligatorio en locales interiores.",
    covidData_alertLevel_hight: "ALTO",
    covidData_alertLevel_medium: "MEDIO",
    covidData_alertLevel_low: "BAJO",
    covidData_alerta: "Nivel de Alerta",
    covidData_numbers_newCasesToday: (province) => `nuevos casos de Covid-19 en ${province} hoy`,
    covidData_numbers_newCasesPast: (province, date) => `nuevos casos de Covid-19 en ${province} el día ${date}`,
    covidData_numbers_casesToday: (province) => `personas tienen Covid-19 en ${province} hoy`,
    covidData_numbers_casesPast: (province, date) => `personas tenían Covid-19 en ${province} el día ${date}`,
    covidData_numbers_percentageToday: (province) => `de la población de ${province} tiene Covid-19 hoy`,
    covidData_numbers_percentagePast: (province, date) =>
        `de la población de ${province} tenían Covid-19 el día ${date}`,
    covidData_provider: "Datos proporcionados por ",
    covidData_and: " y ",
    covidData_noData: "Sin Datos",
    covidData_moveOverSpain: "Desplázate sobre España para ver el estado del virus Covid-19.",

    // GRAPH
    graph_axisLabel: (province) => `% de la población de ${province} que tiene Covid-19`,
    graph_axisLabelBottom: "últimos 14 días",

    // INITIAL JOURNEY
    initialJourney_title: "Cuéntanos un poco sobre ti.",
    initialJourney_vaccinesQuestion: "¿Cuántas vacunas de Covid-19 has recibido?",
    initialJourney_ageQuestion: "¿Cuál es tu rango de edad?",
    initialJourney_error: "Ha ocurrido un error. Reinténtelo más tarde.",
    initialJourney_continue: "Continuar",

    //MAIN
    main_covidButton: "¿Tiene Covid-19?",
    main_lockdownDaysButton: (days) => `Dias restantes confinado: ${days}`,
    main_popup_covidTitle: "¿Tiene Covid-19?",
    main_popup_infoTitle: "Como actuar si tiene Covid-19",
    main_popup_0: "Lea atentamente las siguientes pautas a seguir:",
    main_popup_1: "Quédese en casa excepto para recibir atención médica",
    main_popup_2:
        "La mayoría de las personas con Covid-19 padecen síntomas leves y pueden recuperarse en casa sin atención médica. No salga de su casa, excepto para recibir atención médica. No visite áreas públicas.",
    main_popup_3: "Llame antes de recibir atención médica.",
    main_popup_4: "Sepárese de otras personas",
    main_popup_5:
        "En la medida de lo posible, permanezca en una habitación específica y lejos de otras personas y mascotas en su hogar. Si es posible, debe usar un baño separado. Si necesita estar cerca de otras personas o animales dentro o fuera de la casa, use una máscara.",
    main_popup_6: "Dígale a sus contactos cercanos que pueden haber estado expuestos al Covid-19.",
    main_popup_7:
        "Una persona infectada puede transmitir Covid-19 a partir de 48 horas (o 2 días) antes de que la persona presente algún síntoma o dé positivo en la prueba.",
    main_popup_8: "Controle sus síntomas",
    main_popup_9: "Los síntomas más comunes de Covid-19 incluyen fiebre y tos.",
    main_popup_10: "Si muestra alguno de los siguientes signos, busque atención médica de emergencia de inmediato:",
    main_popup_11: "Dificultad para respirar.",
    main_popup_12: "Dolor o presión persistente en el pecho.",
    main_popup_13: "Estado nuevo de confusión.",
    main_popup_14: "Incapacidad para despertar o permanecer despierto.",
    main_popup_15: "Piel, labios o alrededor de las uñas descoloridas.",
    main_popup_16:
        "Esta lista no incluye todos los síntomas posibles. Llame a su médico por cualquier otro síntoma que sea grave o que le preocupe.",
    main_popup_confirmCovid: "Sí, tengo Covid-19",
    main_popup_cancel: "Cancelar",
    main_popup_close: "Cerrar",
    main_popup_yes: "Sí",
    main_popup_no: "No",
    main_vaccines_first: "primera",
    main_vaccines_second: "segunda",
    main_vaccines_third: "tercera",
    main_vaccines_text: (number) => `Le han puesto la ${number} dosis de la vacuna?`,
    main_language: "Elija el idioma:",

    // ANONYMOUS DATA
    anonymousData: "Todos los datos se almacenan de forma anónima, sin posibilidad de identificar al usuario.",
};

const ENGLISH = {
    name: "English",
    key: "ENGLISH",
    code: "en",
    locale: "en-US",

    // APP
    app_onlyPhone_title: "The Covid-19 app is only available on mobile.",
    app_onlyPhone_subtitle:
        "Scan this QR code to open it on your phone. You can add it to the home screen from your browser settings.",

    // COVID DATA
    covidData_icons_distancing: "Respect a social distance of 2m.",
    covidData_icons_gather: "Do not meet with more than 10 people.",
    covidData_icons_lockdown: "Stay home whenever possible.",
    covidData_icons_mask: "Always wear a mask outside.",
    covidData_icons_night: "Avoid any night activities.",
    covidData_icons_qr: "Covid-19 passport required.",
    covidData_alertLevel_hight: "HIGH",
    covidData_alertLevel_medium: "MEDIUM",
    covidData_alertLevel_low: "LOW",
    covidData_alerta: "Alert Level",
    covidData_numbers_newCasesToday: (province) => `new cases of Covid-19 in ${province} today`,
    covidData_numbers_newCasesPast: (province, date) => `new cases of Covid-19 in ${province} on ${date}`,
    covidData_numbers_casesToday: (province) => `people have Covid-19 in ${province} today`,
    covidData_numbers_casesPast: (province, date) => `people had Covid-19 in ${province} on ${date}`,
    covidData_numbers_percentageToday: (province) => `of the population of ${province} has Covid-19 today`,
    covidData_numbers_percentagePast: (province, date) => `of the population of ${province} had Covid-19 on ${date}`,
    covidData_provider: "Data provided by ",
    covidData_and: " and ",
    covidData_noData: "No data",
    covidData_moveOverSpain: "Pan over Spain to see the status of the Covid-19 virus.",

    // GRAPH
    graph_axisLabel: (province) => `% of the population of ${province} that has Covid-19`,
    graph_axisLabelBottom: "last 14 days",

    // INITIAL JOURNEY
    initialJourney_title: "Tell us a bit about yourself.",
    initialJourney_vaccinesQuestion: "How many Covid-19 vaccines have you received?",
    initialJourney_ageQuestion: "What is your age range?",
    initialJourney_error: "An error has occurred. Please try again later.",
    initialJourney_continue: "Continue",

    //MAIN
    main_covidButton: "Do you have Covid-19?",
    main_lockdownDaysButton: (days) => `Lockdown days remaining: ${days}`,
    main_popup_covidTitle: "Do you have Covid-19?",
    main_popup_infoTitle: "What to do if you have Covid-19",
    main_popup_0: "Read these guidelines carefully:",
    main_popup_1: "Stay home except to receive medical care",
    main_popup_2:
        "Most people with Covid-19 have mild symptoms and can recover at home without medical attention. Do not leave your home except to receive medical attention. Do not visit public areas.",
    main_popup_3: "Call before you get medical attention.",
    main_popup_4: "Separate yourself from other people",
    main_popup_5:
        "As much as possible, stay in a specific room and away from other people and pets in your home. If possible, you should use a separate bathroom. If you need to be around other people or animals inside or outside the house, wear a mask.",
    main_popup_6: "Tell your close contacts that they may have been exposed to Covid-19",
    main_popup_7:
        "An infected person can transmit Covid-19 48 hours (or 2 days) before the person presents any symptoms or tests positive.",
    main_popup_8: "Keep track of your symptoms",
    main_popup_9: "The most common symptoms of Covid-19 include fever and cough.",
    main_popup_10: "If you show any of the following signs, seek emergency medical attention immediately:",
    main_popup_11: "Difficulty breathing.",
    main_popup_12: "Persistent pain or pressure in the chest.",
    main_popup_13: "New state of confusion.",
    main_popup_14: "Inability to wake up or stay awake.",
    main_popup_15: "Discolored skin, lips, or nails.",
    main_popup_16:
        "This list does not include all possible symptoms. Call your doctor for any other symptoms that are serious or that concern you.",
    main_popup_confirmCovid: "Yes, I have Covid-19",
    main_popup_cancel: "Cancel",
    main_popup_close: "Close",
    main_popup_yes: "Yes",
    main_popup_no: "No",
    main_vaccines_first: "first",
    main_vaccines_second: "second",
    main_vaccines_third: "third",
    main_vaccines_text: (number) => `Have you received the ${number} dose of the vaccine?`,
    main_language: "Choose the language:",

    // ANONYMOUS DATA
    anonymousData: "All data is stored anonymously, without the possibility to identify the user.",
};

const CATALAN = {
    name: "Català",
    key: "CATALAN",
    code: "ca",
    locale: "ca-ES",

    // APP
    app_onlyPhone_title: "L'aplicació Covid-19 només està disponible per a mòbil.",
    app_onlyPhone_subtitle:
        "Escaneja aquest codi QR per obrir-la al mòbil. Pots afegir-la a la pantalla inicial des de la configuració del vostre navegador.",

    // COVID DATA
    covidData_icons_distancing: "Respecta una distància social de 2m.",
    covidData_icons_gather: "No et reuneixis amb més de 10 persones.",
    covidData_icons_lockdown: "Queda't a casa sempre que sigui possible.",
    covidData_icons_mask: "Porta mascareta sempre fora de casa.",
    covidData_icons_night: "Evita qualsevol activitat nocturna.",
    covidData_icons_qr: "Passaport Covid-19 obligatori a locals interiors.",
    covidData_alertLevel_hight: "ALT",
    covidData_alertLevel_medium: "MITJÀ",
    covidData_alertLevel_low: "BAIX",
    covidData_alerta: "Nivell d'Alerta",
    covidData_numbers_newCasesToday: (province) => `nous casos de Covid-19 a ${province} avui`,
    covidData_numbers_newCasesPast: (province, date) => `nous casos de Covid-19 a ${province} el dia ${date}`,
    covidData_numbers_casesToday: (province) => `persones tenen Covid-19 a ${province} avui`,
    covidData_numbers_casesPast: (province, date) => `persones tenien Covid-19 a ${province} el dia ${date}`,
    covidData_numbers_percentageToday: (province) => `de la població de ${province} té Covid-19 avui`,
    covidData_numbers_percentagePast: (province, date) =>
        `de la població de ${province} tenien Covid-19 el dia ${date}`,
    covidData_provider: "Dades proporcionades per ",
    covidData_and: " i ",
    covidData_noData: "Sense Dades",
    covidData_moveOverSpain: "Desplaça't sobre Espanya per veure l'estat del virus Covid-19.",

    // GRAPH
    graph_axisLabel: (province) => `% de la població de ${province} que té Covid-19`,
    graph_axisLabelBottom: "darrers 14 dies",

    // INITIAL JOURNEY
    initialJourney_title: "Explica'ns una mica sobre tu.",
    initialJourney_vaccinesQuestion: "Quantes vacunes de Covid-19 has rebut?",
    initialJourney_ageQuestion: "Quin és el teu rang d'edat?",
    initialJourney_error: "S'ha produït un error. Reintenta-ho més tard.",
    initialJourney_continue: "Continuar",

    //MAIN
    main_covidButton: "Tens Covid-19?",
    main_lockdownDaysButton: (days) => `Dies restants confinat: ${days}`,
    main_popup_covidTitle: "Tens Covid-19?",
    main_popup_infoTitle: "Com actuar si tens Covid-19",
    main_popup_0: "Llegiu atentament aquestes pautes a seguir:",
    main_popup_1: "Quedeu-vos a casa excepte per rebre atenció mèdica",
    main_popup_2:
        "La majoria de les persones amb Covid-19 pateixen símptomes lleus i es poden recuperar a casa sense atenció mèdica. No surtis de casa, excepte per rebre atenció mèdica. No visitis àrees públiques.",
    main_popup_3: "Truca abans de rebre atenció mèdica.",
    main_popup_4: "Separeu-vos d'altres persones",
    main_popup_5:
        "En la mesura que sigui possible, queda't en una habitació específica i lluny d'altres persones i mascotes a casa teva. Si és possible, fes servir un bany separat. Si necessites estar a prop d'altres persones o animals dins o fora de la casa, fes servir una màscara.",
    main_popup_6: "Diga-li als teus contactes propers que poden haver estat exposats a la Covid-19",
    main_popup_7:
        "Una persona infectada pot transmetre Covid-19 a partir de 48 hores (o 2 dies) abans de que presenti cap símptoma o doni positiu a la prova.",
    main_popup_8: "Controleu els vostres símptomes",
    main_popup_9: "Els símptomes més comuns de COVID-19 inclouen febre i tos.",
    main_popup_10: "Si mostreu algun dels signes següents, cerqueu atenció mèdica d'emergència immediatament:",
    main_popup_11: "Dificultat per respirar.",
    main_popup_12: "Dolor o pressió persistent al pit.",
    main_popup_13: "Estat nou de confusió.",
    main_popup_14: "Incapacitat per despertar o romandre despert.",
    main_popup_15: "Pell, llavis o el voltant de les ungles descolorides.",
    main_popup_16:
        "Aquesta llista no inclou tots els símptomes possibles. Truqueu al vostre metge per qualsevol altre símptoma que sigui greu o que us preocupi.",
    main_popup_confirmCovid: "Sí, tinc Covid-19",
    main_popup_cancel: "Cancel·lar",
    main_popup_close: "Tancar",
    main_popup_yes: "Sí",
    main_popup_no: "No",
    main_vaccines_first: "primera",
    main_vaccines_second: "segona",
    main_vaccines_third: "tercera",
    main_vaccines_text: (number) => `T'han posat la ${number} dosi de la vacuna?`,
    main_language: "Tria l'idioma:",

    // ANONYMOUS DATA
    anonymousData: "Totes les dades s'emmagatzemen de forma anònima, sense possibilitat d'identificar l'usuari.",
};

const LanguageProvider = (props) => {
    const { getLocationInfo, getGoogleMapsAPIKey } = useContext(API);
    const { getCookie, setCookie } = useContext(Utils);

    // #################################################
    //   LANGUAGE
    // #################################################

    const [language, set] = useState(SPANISH);

    const setLanguage = (lang) => {
        if (lang === SPANISH.key) {
            set(SPANISH);
            setCookie("estado_covid_langd", SPANISH.code, 365 * 50);
        } else if (lang === ENGLISH.key) {
            set(ENGLISH);
            setCookie("estado_covid_langd", ENGLISH.code, 365 * 50);
        } else if (lang === CATALAN.key) {
            set(CATALAN);
            setCookie("estado_covid_langd", CATALAN.code, 365 * 50);
        }
    };

    // #################################################
    //   INITIAL LOCATION
    // #################################################

    useEffect(() => {
        const getLocation = async () => {
            const cookieLanguage = getCookie("estado_covid_langd");

            if (cookieLanguage === SPANISH.code) set(SPANISH);
            else if (cookieLanguage === ENGLISH.code) set(ENGLISH);
            else if (cookieLanguage === CATALAN.code) set(CATALAN);
            else if (navigator.geolocation) {
                await getGoogleMapsAPIKey();

                navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                    const { latitude, longitude } = coords;
                    const result = await getLocationInfo({ lat: latitude, lng: longitude }, "es");
                    if (result.status !== "OK" && result.status !== "ZERO_RESULTS") return;

                    if (result.results.length) {
                        const location = result.results[0].address_components[1].long_name;
                        if (
                            location === "Barcelona" ||
                            location === "Girona" ||
                            location === "Lérida" ||
                            location === "Tarragona"
                        )
                            set(CATALAN);
                    }
                });
            }
        };

        getLocation();
    }, [getGoogleMapsAPIKey, getLocationInfo, getCookie]);

    return (
        <Language.Provider
            value={{
                LANGUAGES,
                language,
                setLanguage,
            }}
        >
            {props.children}
        </Language.Provider>
    );
};

export default LanguageProvider;
