import React, { useContext, useRef } from "react";
import classnames from "classnames";
import { useDrag } from "react-use-gesture";
import { Data } from "../contexts/Data";
import { Utils } from "../contexts/Utils";

export default function DateSlider({ ready }) {
    const { date, setDate } = useContext(Data);
    const { clamp } = useContext(Utils);

    const containerRef = useRef();

    // #################################################
    //   GESTURE
    // #################################################

    // Vertical gesture
    const gestureBind = useDrag(
        ({ xy: [x] }) => {
            var unitWidth = containerRef.current.offsetWidth / 14;
            var containerBox = containerRef.current.getBoundingClientRect();

            const distFromLeft = clamp(x - containerBox.x, 0, containerBox.width);
            const snapValue = 13 - clamp(Math.floor(distFromLeft / unitWidth), 0, 13);
            setDate(snapValue);
        },
        { filterTaps: true, axis: "x" }
    );

    const right = (date * (containerRef.current ? containerRef.current.offsetWidth : 0)) / 14;

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - date);
    currentDate = currentDate.toLocaleString("es-ES").split(" ")[0];

    return (
        <div className="dateSlider">
            <div className={classnames("container", { ready })} {...gestureBind()} ref={containerRef}>
                <div className="point" style={{ right: `${right}px` }}>
                    <p className={classnames("date", { left: date < 7 })}>{currentDate}</p>
                </div>
            </div>
        </div>
    );
}
