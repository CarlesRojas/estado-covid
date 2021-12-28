import React, { useContext } from "react";
import classnames from "classnames";
import { Utils } from "../contexts/Utils";

export default function Button({ text, onClick }) {
    console.log("Render Button");

    const { useCssAnimation } = useContext(Utils);

    const [animating, trigger] = useCssAnimation(300);

    const handleClick = (event) => {
        onClick(event);
        trigger();
    };

    return (
        <div className="button" onClick={handleClick}>
            <div className={classnames("content", { animating })}>{text}</div>
        </div>
    );
}
