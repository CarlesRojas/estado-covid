import React from "react";
import SVG from "react-inlinesvg";

import MarkerIcon from "../resources/icons/marker.svg";

export default function CurrentLocation() {
    console.log("Current Location");

    return (
        <div className="currentLocation">
            <SVG className="marker" src={MarkerIcon} />
        </div>
    );
}
