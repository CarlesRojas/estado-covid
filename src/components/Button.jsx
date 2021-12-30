import React, { useContext } from "react";
import classnames from "classnames";
import { Utils } from "../contexts/Utils";
import SVG from "react-inlinesvg";

export default function Button({ text, onClick, svg, style, styleButton, disabled, extraClass }) {
    const { useCssAnimation } = useContext(Utils);

    const [animating, trigger] = useCssAnimation(300);

    const handleClick = (event) => {
        onClick(event);
        trigger();
    };

    const textContent = text ? (
        <div className={classnames("content", { disabled }, { animating })} style={styleButton}>
            {text}
        </div>
    ) : null;
    const svgContent = svg ? (
        <SVG className={classnames("icon", { disabled }, { animating })} src={svg} style={styleButton} />
    ) : null;

    return (
        <div
            className={classnames("button", extraClass, { disabled }, { grow: text })}
            onClick={handleClick}
            style={style}
        >
            {textContent}
            {svgContent}
        </div>
    );
}
