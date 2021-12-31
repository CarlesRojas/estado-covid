import React, { useContext, useRef, memo } from "react";
import classnames from "classnames";
import { useDrag } from "react-use-gesture";
import { Utils } from "../contexts/Utils";
import { Language } from "../contexts/Language";
import { GlobalState } from "../contexts/GlobalState";
import useGlobalState from "../hooks/useGlobalState";

const DateSlider = memo(() => {
    const { STATE } = useContext(GlobalState);
    const { clamp } = useContext(Utils);
    const { language } = useContext(Language);

    const containerRef = useRef();

    const [date, setDate] = useGlobalState(STATE.date);

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

            if (date !== snapValue) setDate(snapValue);
        },
        { filterTaps: true, axis: "x" }
    );

    const right = (date * (containerRef.current ? containerRef.current.offsetWidth : 0)) / 14;

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - date);
    currentDate = currentDate.toLocaleString(language.locale).split(" ")[0].split(",")[0];

    return (
        <div className="dateSlider">
            <div className="container" {...gestureBind()} ref={containerRef}>
                <div className="point" style={{ right: `${right}px` }}>
                    <p className={classnames("date", { left: date < 7 })}>{currentDate}</p>
                </div>
            </div>
        </div>
    );
});

export default DateSlider;
