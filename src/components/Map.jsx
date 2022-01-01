import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import * as topojson from "topojson-client";
import GoogleMapReact from "google-map-react";
import chroma from "chroma-js";
import { Language } from "../contexts/Language";
import { Utils } from "../contexts/Utils";
import { API } from "../contexts/API";
import { Data } from "../contexts/Data";
import { Events } from "../contexts/Events";
import { GlobalState } from "../contexts/GlobalState";
import useGlobalState from "../hooks/useGlobalState";

import topology from "../resources/maps/spainProvinces.json";
import mapStyle from "../resources/maps/styles/style.json";

const world = topojson.feature(topology, topology.objects.spainProvinces);

export default function Map({ coords }) {
    // console.log("Render Map");

    const { STATE, set } = useContext(GlobalState);
    const { debounce } = useContext(Utils);
    const { language } = useContext(Language);
    const { getLocationInfo, googleAPIKey, updateLocation } = useContext(API);
    const { covidDataProvinces, provinces } = useContext(Data);
    const { EVENT_LIST, sub, unsub } = useContext(Events);

    const [date] = useGlobalState(STATE.date);
    const [userInfo] = useGlobalState(STATE.userInfo);

    // #################################################
    //   LANGUAGE
    // #################################################

    // #################################################
    //   MAP
    // #################################################

    const [mapLoaded, setMapLoaded] = useState(false);
    const map = useRef(null);
    const maps = useRef(null);

    // #################################################
    //   UPDATE CENTER
    // #################################################

    const handleCenterChange = useCallback(
        async (shouldUpdateLocation) => {
            const newCenter = map.current.getCenter();
            const result = await getLocationInfo({ lat: newCenter.lat(), lng: newCenter.lng() }, language.code);
            if (result.status !== "OK" && result.status !== "ZERO_RESULTS") return;

            set(STATE.currentLocation, result.results.length ? result.results[0] : false);

            if (result.results.length && shouldUpdateLocation) {
                let provinceId = "";
                let autonomicCommunityId = "";

                for (let i = 0; i < provinces.current.length; i++) {
                    const element = provinces.current[i];

                    if (element.google_name === result.results[0].address_components[1].long_name) {
                        provinceId = element.id_covid;
                        autonomicCommunityId = element.ca_id_covid;
                        break;
                    }
                }

                await updateLocation(userInfo._id, provinceId, autonomicCommunityId);
            }
        },
        [getLocationInfo, set, STATE, updateLocation, userInfo, provinces, language]
    );

    const locationUpdated = useRef(false);

    useEffect(() => {
        if (!map.current) return;

        const centeChangedListener = map.current.addListener("center_changed", debounce(handleCenterChange, 1000));
        handleCenterChange(!locationUpdated.current);
        locationUpdated.current = true;

        return () => {
            maps.current.event.removeListener(centeChangedListener);
        };
    }, [mapLoaded, debounce, handleCenterChange]);

    // #################################################
    //   MOVE TO CURRENT LOCATION
    // #################################################

    const handleCenterOnCurrentLocation = useCallback(() => {
        map.current.panTo(coords);
    }, [coords]);

    useEffect(() => {
        sub(EVENT_LIST.ON_CENTER_ON_CURRENT_LOCATION, handleCenterOnCurrentLocation);
        return () => {
            unsub(EVENT_LIST.ON_CENTER_ON_CURRENT_LOCATION, handleCenterOnCurrentLocation);
        };
    }, [EVENT_LIST, sub, unsub, handleCenterOnCurrentLocation]);

    // #################################################
    //   APPLY DATA COLORS
    // #################################################

    const chromaScale = useRef(chroma.scale(["white", "red"]));

    const styleFeature = useCallback(
        (feature) => {
            const provinceIndex = parseInt(feature.h.cod_prov) - 1;
            const provinceId = provinces.current[provinceIndex].id_covid;

            const riskValue =
                covidDataProvinces.current[covidDataProvinces.current.length - 1 - date][provinceId].riskValue;

            return {
                clickable: false,
                strokeWeight: 0.5,
                strokeColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1,
                fillColor: chromaScale.current(riskValue).hex(),
                fillOpacity: 0.6,
                visible: true,
                backgroundBlendMode: "multiply",
            };
        },
        [covidDataProvinces, provinces, date]
    );

    // #################################################
    //   UPDATE COLORS
    // #################################################

    useEffect(() => {
        if (map.current) map.current.data.setStyle(styleFeature);
    }, [date, styleFeature]);

    // #################################################
    //   ON MAP LOADED
    // #################################################

    const handleApiLoaded = (googleMap, googleMaps) => {
        maps.current = googleMaps;
        map.current = googleMap;
        setMapLoaded(true);
    };

    // #################################################
    //   ADD GEO JSON
    // #################################################

    const geoJsonApplied = useRef(false);

    useEffect(() => {
        if (!map.current || geoJsonApplied.current) return;
        geoJsonApplied.current = true;

        map.current.data.addGeoJson(world, { idPropertyName: "STATE" });
        map.current.data.setStyle(styleFeature);
    }, [mapLoaded, handleCenterChange, debounce, styleFeature]);

    return (
        <div className="map">
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleAPIKey.current, language: language.code, region: language.code }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                defaultCenter={coords}
                defaultZoom={8}
                options={{
                    styles: mapStyle,
                    minZoom: 5,
                    maxZoom: 11,
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                    gestureHandling: "greedy",
                }}
            ></GoogleMapReact>
        </div>
    );
}
