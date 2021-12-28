import React from "react";
import SVG from "react-inlinesvg";

import VirusIcon from "../resources/icons/virus.svg";

export default function Loading() {
    return (
        <div className="loading">
            <SVG className="icon" src={VirusIcon} />
        </div>
    );
}
