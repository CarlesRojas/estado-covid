import React from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";

export default function Label({ text, svg, style, styleButton }) {
    const textContent = text ? (
        <div className="content" style={styleButton}>
            {text}
        </div>
    ) : null;
    const svgContent = svg ? <SVG className="icon" src={svg} style={styleButton} /> : null;

    return (
        <div className={classnames("label", { grow: text })} style={style}>
            {textContent}
            {svgContent}
        </div>
    );
}
