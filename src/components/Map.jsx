import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import * as topojson from "topojson-client";
import GoogleMapReact from "google-map-react";
import chroma from "chroma-js";
import { Utils } from "../contexts/Utils";
import { API } from "../contexts/API";
import { Data } from "../contexts/Data";

import topology from "../resources/maps/spainProvinces.json";
import mapStyle from "../resources/maps/styles/style.json";

const world = topojson.feature(topology, topology.objects.spainProvinces);

export default function Map({ coords }) {
    const { debounce, invlerp } = useContext(Utils);
    const { getLocationInfo, googleAPIKey } = useContext(API);
    const { covidDataProvinces, provinces, minAndMaxCasesPerCapita, setCurrentLocation, date } = useContext(Data);

    // #################################################
    //   MAP
    // #################################################

    const [map, setMap] = useState(null);
    const maps = useRef(null);

    // #################################################
    //   UPDATE CENTER
    // #################################################

    const handleCenterChange = useCallback(async () => {
        const newCenter = map.getCenter();
        const result = await getLocationInfo({ lat: newCenter.lat(), lng: newCenter.lng() });
        if (result.status !== "OK" && result.status !== "ZERO_RESULTS") return;

        setCurrentLocation(result.results.length ? result.results[0] : false);
    }, [map, getLocationInfo, setCurrentLocation]);

    // #################################################
    //   APPLY DATA COLORS
    // #################################################

    const chromaScale = useRef(chroma.scale(["white", "red"]));

    const styleFeature = useCallback(
        (feature) => {
            const provinceIndex = parseInt(feature.h.cod_prov) - 1;
            const provinceId = provinces.current[provinceIndex].id_covid;

            const color = chromaScale
                .current(
                    invlerp(
                        minAndMaxCasesPerCapita.current.min,
                        minAndMaxCasesPerCapita.current.max,
                        covidDataProvinces.current[covidDataProvinces.current.length - 1 - date][provinceId]
                            .casesPerCapita
                    )
                )
                .hex();

            return {
                clickable: false,
                strokeWeight: 0.5,
                strokeColor: "rgba(0, 0, 0, 1)",
                zIndex: 1,
                fillColor: color,
                fillOpacity: 0.6,
                visible: true,
                backgroundBlendMode: "multiply",
            };
        },
        [covidDataProvinces, invlerp, minAndMaxCasesPerCapita, provinces, date]
    );

    // #################################################
    //   UPDATE COLORS
    // #################################################

    useEffect(() => {
        if (!map) return;
        map.data.setStyle(styleFeature);
    }, [map, date, styleFeature]);

    // #################################################
    //   ON MAP LOADED
    // #################################################

    const handleApiLoaded = (map, googleMaps) => {
        maps.current = googleMaps;
        setMap(map);
    };

    const geoJsonApplied = useRef(false);

    useEffect(() => {
        if (!map || geoJsonApplied.current) return;
        geoJsonApplied.current = true;

        map.data.addGeoJson(world, { idPropertyName: "STATE" });
        map.data.setStyle(styleFeature);
        const centeChangedListener = map.addListener("center_changed", debounce(handleCenterChange, 1000));
        handleCenterChange();

        return () => {
            maps.current.event.removeListener(centeChangedListener);
        };
    }, [map, handleCenterChange, debounce, styleFeature]);

    return (
        <div className="map">
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleAPIKey.current }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                defaultCenter={coords}
                defaultZoom={8}
                options={{
                    styles: mapStyle,
                    minZoom: 5,
                    maxZoom: 9,
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
